// Breed-specific images (lowercase keys)
const BREED_IMAGES = {
  'golden retriever': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
  'labrador': 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=600&h=400&fit=crop',
  'german shepherd': 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=400&fit=crop',
  'bulldog': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=400&fit=crop',
  'poodle': 'https://images.unsplash.com/photo-1616149290228-934e0db0c98a?w=600&h=400&fit=crop',
  'beagle': 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=400&fit=crop',
  'husky': 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=400&fit=crop',
  'siamese': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
  'persian': 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=400&fit=crop',
  'maine coon': 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=600&h=400&fit=crop',
  'macaw': 'https://images.unsplash.com/photo-1501720804996-ae418d1ba820?w=600&h=400&fit=crop',
  'clownfish': 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=400&fit=crop',
  'red-eared slider': 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&h=400&fit=crop',
};

// Fallback by species
const SPECIES_IMAGES = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop',
  bird: 'https://images.unsplash.com/photo-1501720804996-ae418d1ba820?w=600&h=400&fit=crop',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=400&fit=crop',
  reptile: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&h=400&fit=crop',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=400&fit=crop',
  hamster: 'https://images.unsplash.com/photo-1425082661507-6af0db74ab56?w=600&h=400&fit=crop',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=400&fit=crop';

export function getPetImage(species, breed) {
  // Try breed first
  if (breed) {
    const breedImg = BREED_IMAGES[breed.toLowerCase()];
    if (breedImg) return breedImg;
  }
  // Fall back to species
  if (species) {
    const speciesImg = SPECIES_IMAGES[species.toLowerCase()];
    if (speciesImg) return speciesImg;
  }
  return DEFAULT_IMAGE;
}
