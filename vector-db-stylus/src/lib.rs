#![cfg_attr(not(feature = "export-abi"), no_main)]
extern crate alloc;

use alloc::vec::Vec;
use stylus_sdk::{alloy_primitives::{Address, U256}, msg, prelude::*, evm};
use alloy_sol_types::sol;

sol! {
    event VectorAdded(address indexed owner, uint256 indexed id, uint256 dimension);
    event VectorUpdated(address indexed owner, uint256 indexed id);
    event VectorDeleted(address indexed owner, uint256 indexed id);
    event SimilarityComputed(uint256 indexed id1, uint256 indexed id2, uint256 similarity);
}

sol_storage! {
    #[entrypoint]
    pub struct VectorDb {
        mapping(uint256 => address) vector_owners;
        
        mapping(uint256 => uint256) vector_dimensions;
        
        mapping(uint256 => mapping(uint256 => uint256)) vector_components;
        
        uint256 next_vector_id;
        
        uint256 scale_factor;
        
        mapping(uint256 => bytes) vector_metadata;
    }
}

#[public]
impl VectorDb {
    pub fn initialize(&mut self) -> bool {
            self.scale_factor.set(U256::from(2) << 40);
        true
    }
    
    pub fn add_vector(&mut self, components: Vec<U256>, metadata: Vec<u8>) -> U256 {
        let dimension = components.len();
        if dimension == 0 {
            return U256::ZERO;
        }
        
        let id = self.next_vector_id.get();
        
        self.vector_owners.insert(id, msg::sender());
        self.vector_dimensions.insert(id, U256::from(dimension));
        
        if !metadata.is_empty() {
            self.vector_metadata.setter(id).set_bytes(metadata);
        }
        
        for (i, value) in components.iter().enumerate() {
            self.vector_components.setter(id).insert(U256::from(i), *value);
        }
        
        self.next_vector_id.set(id + U256::from(1));
        
        evm::log(VectorAdded {
            owner: msg::sender(),
            id,
            dimension: U256::from(dimension),
        });
        
        id
    }
    
    pub fn update_vector(&mut self, id: U256, components: Vec<U256>) -> bool {
        if self.vector_owners.get(id) == Address::ZERO {
            return false;
        }
        
        if self.vector_owners.get(id) != msg::sender() {
            return false;
        }
        
        let dimension = components.len();
        if dimension == 0 {
            return false;
        }
        
        let old_dimension = self.vector_dimensions.get(id).to::<usize>();
        
        self.vector_dimensions.insert(id, U256::from(dimension));
        
        for (i, value) in components.iter().enumerate() {
            self.vector_components.setter(id).insert(U256::from(i), *value);
        }
        
        if dimension < old_dimension {
            for i in dimension..old_dimension {
                self.vector_components.setter(id).delete(U256::from(i));
            }
        }
        
        evm::log(VectorUpdated {
            owner: msg::sender(),
            id,
        });
        
        true
    }
    
    pub fn delete_vector(&mut self, id: U256) -> bool {
        if self.vector_owners.get(id) == Address::ZERO {
            return false;
        }
        
        if self.vector_owners.get(id) != msg::sender() {
            return false;
        }
        
        let dimension = self.vector_dimensions.get(id).to::<usize>();
        
        for i in 0..dimension {
            self.vector_components.setter(id).delete(U256::from(i));
        }
        
        self.vector_owners.delete(id);
        self.vector_dimensions.delete(id);
        self.vector_metadata.delete(id);
        
        evm::log(VectorDeleted {
            owner: msg::sender(),
            id,
        });
        
        true
    }
    
    pub fn get_component(&self, id: U256, index: U256) -> U256 {
        if self.vector_owners.get(id) == Address::ZERO {
            return U256::ZERO;
        }
        
        let dimension = self.vector_dimensions.get(id);
        
        if index >= dimension {
            return U256::ZERO;
        }
        
        self.vector_components.getter(id).get(index)
    }
    
    pub fn get_dimension(&self, id: U256) -> U256 {
        if self.vector_owners.get(id) == Address::ZERO {
            return U256::ZERO;
        }
        self.vector_dimensions.get(id)
    }
    
    pub fn get_owner(&self, id: U256) -> Address {
        self.vector_owners.get(id)
    }
    
    pub fn dot_product(&mut self, id1: U256, id2: U256) -> U256 {
        if self.vector_owners.get(id1) == Address::ZERO || self.vector_owners.get(id2) == Address::ZERO {
            return U256::ZERO;
        }
        
        let dim1 = self.vector_dimensions.get(id1).to::<usize>();
        let dim2 = self.vector_dimensions.get(id2).to::<usize>();
        
        if dim1 != dim2 {
            return U256::ZERO;
        }
        
        let mut product = U256::ZERO;
        let scale = self.scale_factor.get();
        
        for i in 0..dim1 {
            let i_u256 = U256::from(i);
            let comp1 = self.vector_components.getter(id1).get(i_u256);
            let comp2 = self.vector_components.getter(id2).get(i_u256);
            
            let mult = comp1 * comp2 / scale;
            product = product + mult;
        }
        
        evm::log(SimilarityComputed {
            id1,
            id2,
            similarity: product,
        });
        
        product
    }
    
    pub fn magnitude_squared(&self, id: U256) -> U256 {
        if self.vector_owners.get(id) == Address::ZERO {
            return U256::ZERO;
        }
        
        let dimension = self.vector_dimensions.get(id).to::<usize>();
        
        let mut sum_squares = U256::ZERO;
        let scale = self.scale_factor.get();
        
        for i in 0..dimension {
            let i_u256 = U256::from(i);
            let comp = self.vector_components.getter(id).get(i_u256);
            
            let square = comp * comp / scale;
            sum_squares = sum_squares + square;
        }
        
        sum_squares
    }
    
    pub fn get_count(&self) -> U256 {
        self.next_vector_id.get()
    }
    
    pub fn to_fixed_point(&self, value: U256, decimals: u32) -> U256 {
        let scale = self.scale_factor.get();
        let divisor = U256::from(10).pow(U256::from(decimals));
        value * scale / divisor
    }
    
    pub fn get_scale_factor(&self) -> U256 {
        self.scale_factor.get()
    }
    
    pub fn vector_exists(&self, id: U256) -> bool {
        self.vector_owners.get(id) != Address::ZERO
    }
    
    pub fn cosine_similarity(&mut self, id1: U256, id2: U256) -> U256 {
        let dot = self.dot_product(id1, id2);
        if dot == U256::ZERO {
            return U256::ZERO;
        }
        
        let mag1 = self.magnitude_squared(id1);
        let mag2 = self.magnitude_squared(id2);
        
        if mag1 == U256::ZERO || mag2 == U256::ZERO {
            return U256::ZERO;
        }
        
        let scale = self.scale_factor.get();
        
        let approx_sqrt = |x: U256| -> U256 {
            if x == U256::ZERO {
                return U256::ZERO;
            }
            
            let mut lo = U256::from(1);
            let mut hi = x;
            let mut mid = (lo + hi) / U256::from(2);
            
            for _ in 0..10 {
                let mid_squared = mid * mid;
                
                if mid_squared == x {
                    return mid;
                } else if mid_squared < x {
                    lo = mid;
                } else {
                    hi = mid;
                }
                
                let new_mid = (lo + hi) / U256::from(2);
                if new_mid == mid {
                    break;
                }
                mid = new_mid;
            }
            
            mid
        };
        
        let denom = approx_sqrt(mag1 * mag2);
        
        if denom == U256::ZERO {
            return U256::ZERO;
        }
        
        dot * scale / denom
    }
}