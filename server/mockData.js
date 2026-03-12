/**
 * Mock business data when GOOGLE_MAPS_API_KEY is not set.
 * Matches the shape expected by the frontend.
 */

export const MOCK_BUSINESSES = {
  mortuary: [
    { name: 'Peaceful Rest Funeral Home', address: '1240 Oak Avenue, Suite 100', city: 'Los Angeles', state: 'CA', distance: '2.3 mi', phone: '(555) 234-5678', website: 'https://peacefulrestfh.com', googleReview: 4.8, featured: true, featuredNameBold: true, servicesDescription: 'Full-service funeral planning, traditional and memorial services, cremation options, and pre-planning consultations.', fontFamily: '"Playfair Display", Georgia, serif' },
    { name: 'Serenity Memorial Services', address: '890 Maple Drive', city: 'Pasadena', state: 'CA', distance: '4.1 mi', phone: '(555) 345-6789', website: 'https://serenitymemorial.com', googleReview: 4.6, featured: true, featuredNameBold: false, servicesDescription: 'Memorial services, cremation, burial, and grief support.', fontFamily: '"Lora", Georgia, serif' },
    { name: 'Gentle Goodbyes Mortuary', address: '2100 Cedar Lane', city: 'Glendale', state: 'CA', distance: '6.7 mi', phone: '(555) 456-7890', website: 'https://gentlegoodbyes.com', googleReview: 4.9 },
    { name: 'Evergreen Funeral & Cremation', address: '450 Pine Street', city: 'Burbank', state: 'CA', distance: '8.2 mi', phone: '(555) 567-8901', website: 'https://evergreenfuneral.com', googleReview: 4.5 },
    { name: 'Horizon Family Mortuary', address: '3200 Sunset Blvd', city: 'Los Angeles', state: 'CA', distance: '11.4 mi', phone: '(555) 678-9012', website: 'https://horizonfamilymortuary.com', googleReview: 4.7 },
  ],
  cremation: [
    { name: 'Radiant Light Cremation Services', address: '560 Willow Way', city: 'Anaheim', state: 'CA', distance: '1.8 mi', phone: '(555) 789-0123', website: 'https://radiantlightcremation.com', googleReview: 4.9, featured: true, featuredNameBold: true, servicesDescription: 'Direct cremation, memorial cremation, witness cremation, and ash keepsakes.', fontFamily: '"Libre Baskerville", Georgia, serif' },
    { name: 'Simple Grace Cremation', address: '1200 Elm Street', city: 'Santa Ana', state: 'CA', distance: '3.5 mi', phone: '(555) 890-1234', website: 'https://simplegracecremation.com', googleReview: 4.7, featured: true, featuredNameBold: false, servicesDescription: 'Affordable cremation services and memorial options.', fontFamily: '"Lora", Georgia, serif' },
    { name: 'Gentle Flame Crematory', address: '780 Birch Road', city: 'Irvine', state: 'CA', distance: '5.2 mi', phone: '(555) 901-2345', website: 'https://gentleflame.com', googleReview: 4.8 },
    { name: 'Tranquil Ashes Cremation', address: '2100 Spruce Ave', city: 'Costa Mesa', state: 'CA', distance: '7.1 mi', phone: '(555) 012-3456', website: 'https://tranquilashes.com', googleReview: 4.6 },
    { name: 'Everlasting Peace Cremation', address: '3400 Laurel Drive', city: 'Orange', state: 'CA', distance: '9.3 mi', phone: '(555) 123-4567', website: 'https://everlastingpeacecremation.com', googleReview: 4.9 },
  ],
  cemetery: [
    { name: 'Memorial Gardens Cemetery', address: '5000 Garden View Road', city: 'Riverside', state: 'CA', distance: '2.0 mi', phone: '(555) 234-1111', website: 'https://memorialgardens.org', googleReview: 4.7, featured: true, featuredNameBold: true, servicesDescription: 'Burial plots, mausoleums, green burial, and perpetual care.', businessType: 'Cemetery', fontFamily: '"Playfair Display", Georgia, serif' },
    { name: 'Pacific Horizon Sea Burials', address: '200 Marina Way', city: 'Long Beach', state: 'CA', distance: '3.2 mi', phone: '(555) 445-2000', website: 'https://pacifichorizonseaburials.com', googleReview: 4.8, featured: true, featuredNameBold: false, servicesDescription: 'Burials at sea, ash scattering at sea, and memorial boat services.', businessType: 'Burials at sea', fontFamily: '"Libre Baskerville", Georgia, serif' },
    { name: 'Green Valley Memorial Park', address: '1800 Valley Lane', city: 'San Bernardino', state: 'CA', distance: '4.6 mi', phone: '(555) 345-2222', website: 'https://greenvalleymemorial.org', googleReview: 4.8, businessType: 'Cemetery' },
    { name: 'Sacred Ashes Scattering Services', address: '880 Coast Highway', city: 'Newport Beach', state: 'CA', distance: '5.1 mi', phone: '(555) 667-3300', website: 'https://sacredashesscattering.com', googleReview: 4.6, servicesDescription: 'Spreading of ashes at sea, in gardens, or at meaningful locations.', businessType: 'Spreading of ashes' },
    { name: 'Oak Haven Cemetery', address: '2900 Oak Haven Way', city: 'Fontana', state: 'CA', distance: '6.2 mi', phone: '(555) 456-3333', website: 'https://oakhavencemetery.com', googleReview: 4.5, businessType: 'Cemetery' },
    { name: 'Ocean Peace Burials at Sea', address: '1500 Harbor Blvd', city: 'San Pedro', state: 'CA', distance: '7.4 mi', phone: '(555) 778-4400', website: 'https://oceanpeaceburials.com', googleReview: 4.9, servicesDescription: 'Full burials at sea and ash scattering voyages; family can attend.', businessType: 'Burials at sea' },
    { name: 'Sunset Rest Cemetery', address: '4100 Sunset Hills Dr', city: 'Corona', state: 'CA', distance: '8.9 mi', phone: '(555) 567-4444', website: 'https://sunsetrest.org', googleReview: 4.6, businessType: 'Cemetery' },
    { name: 'Memorial Ashes & Scattering', address: '420 Vista del Mar', city: 'Redondo Beach', state: 'CA', distance: '9.0 mi', phone: '(555) 889-5500', website: 'https://memorialashesscattering.com', googleReview: 4.7, businessType: 'Spreading of ashes' },
    { name: 'Eternal Peace Memorial', address: '5200 Peace Lane', city: 'Moreno Valley', state: 'CA', distance: '12.1 mi', phone: '(555) 678-5555', website: 'https://eternalpeacememorial.com', googleReview: 4.9, businessType: 'Cemetery' },
  ],
}

export const SPREADING_AND_SEA = [
  { name: 'Pacific Horizon Sea Burials', address: '200 Marina Way', city: 'Long Beach', state: 'CA', distance: '3.2 mi', phone: '(555) 445-2000', website: 'https://pacifichorizonseaburials.com', googleReview: 4.8, servicesDescription: 'Burials at sea, ash scattering at sea, and memorial boat services.', businessType: 'Burials at sea', featured: true, featuredNameBold: true, fontFamily: '"Playfair Display", Georgia, serif' },
  { name: 'Sacred Ashes Scattering Services', address: '880 Coast Highway', city: 'Newport Beach', state: 'CA', distance: '5.1 mi', phone: '(555) 667-3300', website: 'https://sacredashesscattering.com', googleReview: 4.6, servicesDescription: 'Spreading of ashes at sea, in gardens, or at meaningful locations.', businessType: 'Spreading of ashes', featured: true, featuredNameBold: false, fontFamily: '"Lora", Georgia, serif' },
  { name: 'Ocean Peace Burials at Sea', address: '1500 Harbor Blvd', city: 'San Pedro', state: 'CA', distance: '7.4 mi', phone: '(555) 778-4400', website: 'https://oceanpeaceburials.com', googleReview: 4.9, servicesDescription: 'Full burials at sea and ash scattering voyages; family can attend.', businessType: 'Burials at sea' },
  { name: 'Memorial Ashes & Scattering', address: '420 Vista del Mar', city: 'Redondo Beach', state: 'CA', distance: '9.0 mi', phone: '(555) 889-5500', website: 'https://memorialashesscattering.com', googleReview: 4.7, businessType: 'Spreading of ashes' },
  { name: 'Coastal Ash Scattering', address: '100 Ocean Dr', city: 'Santa Monica', state: 'CA', distance: '45 mi', phone: '(555) 221-6600', website: 'https://coastalashscattering.com', googleReview: 4.5, businessType: 'Spreading of ashes' },
  { name: 'Eternal Waves Sea Services', address: '3200 Harbor Island Dr', city: 'San Diego', state: 'CA', distance: '95 mi', phone: '(555) 332-7700', website: 'https://eternalwavessea.com', googleReview: 4.8, businessType: 'Burials at sea' },
  { name: 'Mountain & Sea Memorials', address: '5500 PCH', city: 'Malibu', state: 'CA', distance: '52 mi', phone: '(555) 443-8800', website: 'https://mountainseamemorials.com', googleReview: 4.6, businessType: 'Spreading of ashes' },
  { name: 'Pacific Memorial Sea Burials', address: '2500 N Harbor Dr', city: 'San Diego', state: 'CA', distance: '98 mi', phone: '(555) 554-9900', website: 'https://pacificmemorialsea.com', googleReview: 4.9, businessType: 'Burials at sea' },
  { name: 'Ashes to Ocean', address: '7700 Sand Canyon Ave', city: 'Irvine', state: 'CA', distance: '12 mi', phone: '(555) 665-1100', website: 'https://ashestoocean.com', googleReview: 4.7, businessType: 'Spreading of ashes' },
  { name: 'Horizon Ash Scattering', address: '1800 Bay St', city: 'San Francisco', state: 'CA', distance: '348 mi', phone: '(555) 776-2200', website: 'https://horizonashscattering.com', googleReview: 4.8, businessType: 'Spreading of ashes' },
]
