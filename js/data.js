/**
 * AgriLocal Application Data Store
 * All verified entities, mock stores, products, prices, and gallery metadata.
 */

// Mandals & Geographic Configuration (single constant for easy adaptation)
const MANDAL_CONFIG = {
  village: "Dakamarri Village",
  mandal: "Bheemunipatnam Mandal",
  district: "Visakhapatnam District",
  state: "Andhra Pradesh",
  pin: "531162",
  coordinates: {
    lat: 17.9900,
    lng: 83.4004
  },
  surveyDate: "08 October 2026",
  cohortRange: "24981A0422 to 24981A0430",
  institution: "Raghu Engineering College"
};

// 12 Agricultural Products Documented During Fieldwork
const PRODUCTS_DATA = [
  {
    id: "prod-1",
    name: "Cowpea seeds (Ankur Ketaki)",
    category: "Seeds",
    description: "High-yielding cowpea pulse variety suitable for coastal red loamy soil, resistant to common rust and pod borers.",
    defaultUnit: "500g pouch",
    icon: "🌱"
  },
  {
    id: "prod-2",
    name: "Permethrin 25% EC Insecticide",
    category: "Pesticides",
    description: "Synthetic pyrethroid broad-spectrum insecticide for controlling bollworms, foliar caterpillar, and pod borers.",
    defaultUnit: "500ml bottle",
    icon: "🛡️"
  },
  {
    id: "prod-3",
    name: "Paddy Seeds (BPT 5204 Samba Masuri)",
    category: "Seeds",
    description: "Premium fine-grain paddy seed variety widely grown in irrigated belts of Visakhapatnam district.",
    defaultUnit: "25kg bag",
    icon: "🌾"
  },
  {
    id: "prod-4",
    name: "Neem Oil 10000 PPM Bio-Pesticide",
    category: "Pesticides",
    description: "Organic cold-pressed azadirachtin formulation effective against whiteflies, aphids, and sucking pests.",
    defaultUnit: "1L can",
    icon: "🍃"
  },
  {
    id: "prod-5",
    name: "Urea 46% Nitrogen Fertilizer",
    category: "Fertilizers",
    description: "Neem coated nitrogenous fertilizer providing rapid vegetative growth for field crops.",
    defaultUnit: "45kg bag",
    icon: "🧪"
  },
  {
    id: "prod-6",
    name: "DAP (Di-Ammonium Phosphate 18:46:0)",
    category: "Fertilizers",
    description: "Phosphatic basal fertilizer essential for vigorous root proliferation during sowing.",
    defaultUnit: "50kg bag",
    icon: "⚗️"
  },
  {
    id: "prod-7",
    name: "MOP (Muriate of Potash 60% K2O)",
    category: "Fertilizers",
    description: "Potassic fertilizer boosting grain weight, pest resistance, and drought tolerance.",
    defaultUnit: "50kg bag",
    icon: "💎"
  },
  {
    id: "prod-8",
    name: "Chlorpyrifos 20% EC",
    category: "Pesticides",
    description: "Organophosphate formulation for soil treatment against termites and cutworms.",
    defaultUnit: "1L tin",
    icon: "🧴"
  },
  {
    id: "prod-9",
    name: "Tomato Hybrid Seeds (Abhilash F1)",
    category: "Seeds",
    description: "Vigorous semi-determinate hybrid yielding firm deep-red fruits with prolonged shelf life.",
    defaultUnit: "10g pack",
    icon: "🍅"
  },
  {
    id: "prod-10",
    name: "Knapsack Manual Pressure Sprayer 16L",
    category: "Equipment",
    description: "Heavy-duty ergonomic backpack sprayer with brass lance for foliar spray applications.",
    defaultUnit: "1 Unit",
    icon: "⚙️"
  },
  {
    id: "prod-11",
    name: "Battery Operated 2-in-1 Sprayer",
    category: "Equipment",
    description: "Rechargeable 12V 8Ah battery sprayer with dual motor option for effortless spraying.",
    defaultUnit: "1 Unit",
    icon: "🔋"
  },
  {
    id: "prod-12",
    name: "Trichoderma Viride Bio-Fungicide",
    category: "Pesticides",
    description: "Antagonistic fungal biological control agent preventing seed rot and damping-off disease.",
    defaultUnit: "1kg pack",
    icon: "🔬"
  }
];

// 8 Verified Demo Agricultural Shops across Dakamarri, Tagarapuvalasa & Anandapuram
const SHOPS_DATA = [
  {
    id: "shop-1",
    name: "Demo Agro Store 1 (Kisan Seva Kendra)",
    area: "Dakamarri",
    address: "Near Village Panchayat Office, Main Road, Dakamarri - 531162",
    phone: "90000 00001",
    hours: "07:30 AM - 08:30 PM",
    verifiedDate: "08 Oct 2026",
    coords: { lat: 17.9902, lng: 83.4010 },
    productsStocked: [
      "Cowpea seeds (Ankur Ketaki)",
      "Permethrin 25% EC Insecticide",
      "Paddy Seeds (BPT 5204 Samba Masuri)",
      "Urea 46% Nitrogen Fertilizer",
      "Neem Oil 10000 PPM Bio-Pesticide"
    ]
  },
  {
    id: "shop-2",
    name: "Demo Agro Store 2 (Rythu Mithra Center)",
    area: "Dakamarri",
    address: "Opposite High School, Dakamarri Village - 531162",
    phone: "90000 00002",
    hours: "08:00 AM - 08:00 PM",
    verifiedDate: "08 Oct 2026",
    coords: { lat: 17.9895, lng: 83.4002 },
    productsStocked: [
      "Cowpea seeds (Ankur Ketaki)",
      "DAP (Di-Ammonium Phosphate 18:46:0)",
      "MOP (Muriate of Potash 60% K2O)",
      "Tomato Hybrid Seeds (Abhilash F1)",
      "Trichoderma Viride Bio-Fungicide"
    ]
  },
  {
    id: "shop-3",
    name: "Demo Agro Store 3 (Sri Rama Agro Agencies)",
    area: "Tagarapuvalasa",
    address: "Bheemili Road Junction, Tagarapuvalasa - 531162",
    phone: "90000 00003",
    hours: "07:00 AM - 09:00 PM",
    verifiedDate: "07 Oct 2026",
    coords: { lat: 17.9351, lng: 83.4278 },
    productsStocked: [
      "Cowpea seeds (Ankur Ketaki)",
      "Permethrin 25% EC Insecticide",
      "Chlorpyrifos 20% EC",
      "Knapsack Manual Pressure Sprayer 16L",
      "Urea 46% Nitrogen Fertilizer",
      "Paddy Seeds (BPT 5204 Samba Masuri)"
    ]
  },
  {
    id: "shop-4",
    name: "Demo Agro Store 4 (Annapurna Fertilizers & Seeds)",
    area: "Tagarapuvalasa",
    address: "Old National Highway, Near Bus Station, Tagarapuvalasa - 531162",
    phone: "90000 00004",
    hours: "07:30 AM - 08:30 PM",
    verifiedDate: "07 Oct 2026",
    coords: { lat: 17.9335, lng: 83.4301 },
    productsStocked: [
      "Cowpea seeds (Ankur Ketaki)",
      "Permethrin 25% EC Insecticide",
      "DAP (Di-Ammonium Phosphate 18:46:0)",
      "Battery Operated 2-in-1 Sprayer",
      "Neem Oil 10000 PPM Bio-Pesticide"
    ]
  },
  {
    id: "shop-5",
    name: "Demo Agro Store 5 (Bheemili Valley Kisan Mart)",
    area: "Tagarapuvalasa",
    address: "Market Yard Road, Tagarapuvalasa - 531162",
    phone: "90000 00005",
    hours: "08:00 AM - 08:30 PM",
    verifiedDate: "06 Oct 2026",
    coords: { lat: 17.9362, lng: 83.4260 },
    productsStocked: [
      "Permethrin 25% EC Insecticide",
      "MOP (Muriate of Potash 60% K2O)",
      "Tomato Hybrid Seeds (Abhilash F1)",
      "Trichoderma Viride Bio-Fungicide",
      "Knapsack Manual Pressure Sprayer 16L"
    ]
  },
  {
    id: "shop-6",
    name: "Demo Agro Store 6 (Anandapuram Agro Supplies)",
    area: "Anandapuram",
    address: "National Highway 16 Cross, Anandapuram - 530052",
    phone: "90000 00006",
    hours: "06:30 AM - 09:30 PM",
    verifiedDate: "07 Oct 2026",
    coords: { lat: 17.9080, lng: 83.3980 },
    productsStocked: [
      "Cowpea seeds (Ankur Ketaki)",
      "Permethrin 25% EC Insecticide",
      "Urea 46% Nitrogen Fertilizer",
      "DAP (Di-Ammonium Phosphate 18:46:0)",
      "Battery Operated 2-in-1 Sprayer"
    ]
  },
  {
    id: "shop-7",
    name: "Demo Agro Store 7 (Prakruthi Bio Inputs)",
    area: "Anandapuram",
    address: "Gudilova Road Junction, Anandapuram - 530052",
    phone: "90000 00007",
    hours: "08:00 AM - 07:30 PM",
    verifiedDate: "08 Oct 2026",
    coords: { lat: 17.9095, lng: 83.3955 },
    productsStocked: [
      "Cowpea seeds (Ankur Ketaki)",
      "Neem Oil 10000 PPM Bio-Pesticide",
      "Trichoderma Viride Bio-Fungicide",
      "Tomato Hybrid Seeds (Abhilash F1)"
    ]
  },
  {
    id: "shop-8",
    name: "Demo Agro Store 8 (Sri Venkateswara Krishi Seva)",
    area: "Dakamarri",
    address: "Towards Raghu Engineering College Road, Dakamarri - 531162",
    phone: "90000 00008",
    hours: "07:00 AM - 08:00 PM",
    verifiedDate: "08 Oct 2026",
    coords: { lat: 17.9920, lng: 83.4025 },
    productsStocked: [
      "Cowpea seeds (Ankur Ketaki)",
      "Permethrin 25% EC Insecticide",
      "Paddy Seeds (BPT 5204 Samba Masuri)",
      "Chlorpyrifos 20% EC",
      "Knapsack Manual Pressure Sprayer 16L"
    ]
  }
];

// Price Mapping Matrix Across Shops
const PRICES_DATA = [
  // Cowpea seeds (Ankur Ketaki)
  { shopId: "shop-1", productId: "prod-1", price: 340, unit: "500g pouch", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-2", productId: "prod-1", price: 350, unit: "500g pouch", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-3", productId: "prod-1", price: 330, unit: "500g pouch", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-4", productId: "prod-1", price: 345, unit: "500g pouch", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-6", productId: "prod-1", price: 335, unit: "500g pouch", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-7", productId: "prod-1", price: 360, unit: "500g pouch", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-8", productId: "prod-1", price: 335, unit: "500g pouch", lastUpdated: "08 Oct 2026" },

  // Permethrin 25% EC Insecticide
  { shopId: "shop-1", productId: "prod-2", price: 420, unit: "500ml bottle", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-3", productId: "prod-2", price: 405, unit: "500ml bottle", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-4", productId: "prod-2", price: 415, unit: "500ml bottle", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-5", productId: "prod-2", price: 410, unit: "500ml bottle", lastUpdated: "06 Oct 2026" },
  { shopId: "shop-6", productId: "prod-2", price: 400, unit: "500ml bottle", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-8", productId: "prod-2", price: 425, unit: "500ml bottle", lastUpdated: "08 Oct 2026" },

  // Paddy Seeds (BPT 5204)
  { shopId: "shop-1", productId: "prod-3", price: 1100, unit: "25kg bag", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-3", productId: "prod-3", price: 1080, unit: "25kg bag", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-8", productId: "prod-3", price: 1090, unit: "25kg bag", lastUpdated: "08 Oct 2026" },

  // Neem Oil 10000 PPM
  { shopId: "shop-1", productId: "prod-4", price: 580, unit: "1L can", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-4", productId: "prod-4", price: 560, unit: "1L can", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-7", productId: "prod-4", price: 550, unit: "1L can", lastUpdated: "08 Oct 2026" },

  // Urea 46%
  { shopId: "shop-1", productId: "prod-5", price: 267, unit: "45kg bag (Govt Fixed)", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-3", productId: "prod-5", price: 267, unit: "45kg bag (Govt Fixed)", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-6", productId: "prod-5", price: 267, unit: "45kg bag (Govt Fixed)", lastUpdated: "07 Oct 2026" },

  // DAP 18:46:0
  { shopId: "shop-2", productId: "prod-6", price: 1350, unit: "50kg bag", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-4", productId: "prod-6", price: 1350, unit: "50kg bag", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-6", productId: "prod-6", price: 1340, unit: "50kg bag", lastUpdated: "07 Oct 2026" },

  // MOP
  { shopId: "shop-2", productId: "prod-7", price: 1700, unit: "50kg bag", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-5", productId: "prod-7", price: 1680, unit: "50kg bag", lastUpdated: "06 Oct 2026" },

  // Chlorpyrifos 20% EC
  { shopId: "shop-3", productId: "prod-8", price: 490, unit: "1L tin", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-8", productId: "prod-8", price: 510, unit: "1L tin", lastUpdated: "08 Oct 2026" },

  // Tomato Hybrid Seeds
  { shopId: "shop-2", productId: "prod-9", price: 420, unit: "10g pack", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-5", productId: "prod-9", price: 430, unit: "10g pack", lastUpdated: "06 Oct 2026" },
  { shopId: "shop-7", productId: "prod-9", price: 415, unit: "10g pack", lastUpdated: "08 Oct 2026" },

  // Knapsack Sprayer 16L
  { shopId: "shop-3", productId: "prod-10", price: 1450, unit: "1 Unit", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-5", productId: "prod-10", price: 1400, unit: "1 Unit", lastUpdated: "06 Oct 2026" },
  { shopId: "shop-8", productId: "prod-10", price: 1480, unit: "1 Unit", lastUpdated: "08 Oct 2026" },

  // Battery Sprayer 2-in-1
  { shopId: "shop-4", productId: "prod-11", price: 3100, unit: "1 Unit", lastUpdated: "07 Oct 2026" },
  { shopId: "shop-6", productId: "prod-11", price: 2950, unit: "1 Unit", lastUpdated: "07 Oct 2026" },

  // Trichoderma Viride
  { shopId: "shop-2", productId: "prod-12", price: 190, unit: "1kg pack", lastUpdated: "08 Oct 2026" },
  { shopId: "shop-5", productId: "prod-12", price: 180, unit: "1kg pack", lastUpdated: "06 Oct 2026" },
  { shopId: "shop-7", productId: "prod-12", price: 175, unit: "1kg pack", lastUpdated: "08 Oct 2026" }
];

// Gallery Photographic Records Array (easily extendable by adding objects)
const GALLERY_DATA = [
  {
    id: "gal-1",
    src: "images/consent-letter.jpg",
    title: "Village Administrative Consent Letter",
    caption: "Formal letter signed and approved by the Village Revenue Officer (VRO) on 08/10/2026 sanctioning student community service survey in Dakamarri.",
    tag: "Official Clearance",
    fallbackColor: "#1e3a29"
  },
  {
    id: "gal-2",
    src: "images/team-photo.jpg",
    title: "Team Deployment at Dakamarri",
    caption: "ECE-A (3rd Year) student survey cohort (Reg. Nos. 24981A0422 to 24981A0430) on-site at Dakamarri Village, Raghu Engineering College.",
    tag: "Student Cohort",
    fallbackColor: "#1a3622"
  },
  {
    id: "gal-3",
    src: "images/prototype-testing.jpg",
    title: "Farmer Testing the AgriLocal Mobile Concept",
    caption: "Demonstrating the dual-language shop discovery interface to a village cultivator, validating Telugu typography and phone dialer links.",
    tag: "Concept Demo",
    fallbackColor: "#22422b"
  },
  {
    id: "gal-4",
    src: "images/inputs-cataloged.jpg",
    title: "Cowpea Seed Packet & Permethrin Cataloged",
    caption: "Physical verification and price mapping of Cowpea seeds (Ankur Ketaki) and Permethrin 25% EC insecticide observed in local agriculture outlets.",
    tag: "Input Mapping",
    fallbackColor: "#2f4d36"
  },
  {
    id: "gal-5",
    src: "images/field-survey-1.jpg",
    title: "Household Agricultural Inquiries",
    caption: "Gathering qualitative survey responses regarding travel distances and seed stock uncertainty during peak sowing windows.",
    tag: "Farmer Survey",
    fallbackColor: "#1f3b28"
  },
  {
    id: "gal-6",
    src: "images/field-survey-2.jpg",
    title: "Fieldwork Survey Interaction",
    caption: "Students discussing fertilizer procurement timing and price variations across Tagarapuvalasa and Dakamarri vendors.",
    tag: "Farmer Survey",
    fallbackColor: "#264831"
  },
  {
    id: "gal-7",
    src: "images/shop-visit-1.jpg",
    title: "Agro Dealer Interaction & Price Audit",
    caption: "Documenting dealer retail catalogs, operating hours, and verifying packaging units across local pesticide retailers.",
    tag: "Vendor Audit",
    fallbackColor: "#2a4d33"
  },
  {
    id: "gal-8",
    src: "images/farmer-interaction.jpg",
    title: "Community Dialogue on Input Access",
    caption: "Farmers highlighting the utility of instant phone verification prior to committing transit time.",
    tag: "Feedback",
    fallbackColor: "#203e29"
  }
];
