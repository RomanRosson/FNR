// Comprehensive Motorcycle Database
// This file contains motorcycle data organized by manufacturer, model, and year
// You can expand this by scraping data from motorcycle websites

export const motorcycleDatabase = {
  'Honda': {
    'CBR600RR': {
      years: [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '599cc',
      type: 'Supersport'
    },
    'CBR1000RR': {
      years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '999cc',
      type: 'Superbike'
    },
    'CB650R': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '649cc',
      type: 'Street'
    },
    'CRF300L': {
      years: [2021, 2022, 2023, 2024],
      category: 'Dual Sport',
      engineSize: '286cc',
      type: 'Adventure'
    },
    'CRF450R': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Motocross',
      engineSize: '449cc',
      type: 'Racing'
    },
    'Gold Wing': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Touring',
      engineSize: '1833cc',
      type: 'Luxury Touring'
    },
    'Rebel 300': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Cruiser',
      engineSize: '286cc',
      type: 'Entry Level'
    },
    'Rebel 500': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Cruiser',
      engineSize: '471cc',
      type: 'Mid Range'
    },
    'Africa Twin': {
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '1084cc',
      type: 'Adventure Touring'
    }
  },
  
  'Yamaha': {
    'YZF-R6': {
      years: [2017, 2018, 2019, 2020, 2021],
      category: 'Sport',
      engineSize: '599cc',
      type: 'Supersport'
    },
    'YZF-R1': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '998cc',
      type: 'Superbike'
    },
    'MT-07': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '689cc',
      type: 'Street'
    },
    'MT-09': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '847cc',
      type: 'Street'
    },
    'YZF-R3': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '321cc',
      type: 'Entry Level'
    },
    'FZ-07': {
      years: [2015, 2016, 2017, 2018, 2019, 2020],
      category: 'Naked',
      engineSize: '689cc',
      type: 'Street'
    },
    'Super Tenere': {
      years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '1199cc',
      type: 'Adventure Touring'
    },
    'VMAX': {
      years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
      category: 'Cruiser',
      engineSize: '1679cc',
      type: 'Muscle Cruiser'
    }
  },
  
  'Kawasaki': {
    'Ninja 650': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '649cc',
      type: 'Sport Touring'
    },
    'Ninja ZX-6R': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '636cc',
      type: 'Supersport'
    },
    'Ninja ZX-10R': {
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '998cc',
      type: 'Superbike'
    },
    'Versys 650': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '649cc',
      type: 'Adventure Touring'
    },
    'Ninja 400': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '399cc',
      type: 'Entry Level'
    },
    'Z650': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '649cc',
      type: 'Street'
    },
    'Z900': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '948cc',
      type: 'Street'
    },
    'KLR650': {
      years: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Dual Sport',
      engineSize: '652cc',
      type: 'Adventure'
    }
  },
  
  'Suzuki': {
    'GSX-R600': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
      category: 'Sport',
      engineSize: '599cc',
      type: 'Supersport'
    },
    'GSX-R750': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '750cc',
      type: 'Supersport'
    },
    'GSX-R1000': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '999cc',
      type: 'Superbike'
    },
    'SV650': {
      years: [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '645cc',
      type: 'Street'
    },
    'GSX-S750': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '749cc',
      type: 'Street'
    },
    'GSX-S1000': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '999cc',
      type: 'Street'
    },
    'V-Strom 650': {
      years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '645cc',
      type: 'Adventure Touring'
    },
    'V-Strom 1000': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '1037cc',
      type: 'Adventure Touring'
    }
  },
  
  'Ducati': {
    'Panigale V2': {
      years: [2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '955cc',
      type: 'Supersport'
    },
    'Panigale V4': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '1103cc',
      type: 'Superbike'
    },
    'Monster 821': {
      years: [2017, 2018, 2019, 2020, 2021, 2022],
      category: 'Naked',
      engineSize: '821cc',
      type: 'Street'
    },
    'Monster 937': {
      years: [2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '937cc',
      type: 'Street'
    },
    'Multistrada V4': {
      years: [2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '1158cc',
      type: 'Adventure Touring'
    },
    'Scrambler 1100': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Retro',
      engineSize: '1079cc',
      type: 'Modern Classic'
    },
    'Diavel': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Cruiser',
      engineSize: '1262cc',
      type: 'Power Cruiser'
    },
    'Streetfighter V4': {
      years: [2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '1103cc',
      type: 'Super Naked'
    }
  },
  
  'BMW': {
    'S1000RR': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '999cc',
      type: 'Superbike'
    },
    'S1000R': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '999cc',
      type: 'Super Naked'
    },
    'R1250GS': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '1254cc',
      type: 'Adventure Touring'
    },
    'F850GS': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '853cc',
      type: 'Adventure Touring'
    },
    'K1600GT': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Touring',
      engineSize: '1649cc',
      type: 'Luxury Touring'
    },
    'R18': {
      years: [2021, 2022, 2023, 2024],
      category: 'Cruiser',
      engineSize: '1802cc',
      type: 'Heritage Cruiser'
    }
  },
  
  'KTM': {
    '1290 Super Duke R': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '1301cc',
      type: 'Super Naked'
    },
    '790 Duke': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '799cc',
      type: 'Street'
    },
    '390 Duke': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '373cc',
      type: 'Entry Level'
    },
    '1290 Adventure': {
      years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '1301cc',
      type: 'Adventure Touring'
    },
    '890 Adventure': {
      years: [2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '889cc',
      type: 'Adventure Touring'
    },
    'RC390': {
      years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '373cc',
      type: 'Entry Level'
    }
  },
  
  'Aprilia': {
    'RSV4': {
      years: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '1099cc',
      type: 'Superbike'
    },
    'Tuono V4': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '1099cc',
      type: 'Super Naked'
    },
    'RS660': {
      years: [2021, 2022, 2023, 2024],
      category: 'Sport',
      engineSize: '659cc',
      type: 'Supersport'
    },
    'Tuono 660': {
      years: [2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '659cc',
      type: 'Street'
    }
  },
  
  'Triumph': {
    'Speed Triple': {
      years: [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '1050cc',
      type: 'Super Naked'
    },
    'Street Triple': {
      years: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Naked',
      engineSize: '765cc',
      type: 'Street'
    },
    'Tiger 1200': {
      years: [2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '1215cc',
      type: 'Adventure Touring'
    },
    'Tiger 900': {
      years: [2020, 2021, 2022, 2023, 2024],
      category: 'Adventure',
      engineSize: '888cc',
      type: 'Adventure Touring'
    },
    'Bonneville T120': {
      years: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Retro',
      engineSize: '1200cc',
      type: 'Modern Classic'
    },
    'Rocket 3': {
      years: [2019, 2020, 2021, 2022, 2023, 2024],
      category: 'Cruiser',
      engineSize: '2458cc',
      type: 'Power Cruiser'
    }
  }
};

// Helper functions for accessing the database
export const getMotorcycleMakes = () => {
  return Object.keys(motorcycleDatabase);
};

export const getMotorcycleModels = (make) => {
  if (!make || !motorcycleDatabase[make]) return [];
  return Object.keys(motorcycleDatabase[make]);
};

export const getMotorcycleYears = (make, model) => {
  if (!make || !model || !motorcycleDatabase[make] || !motorcycleDatabase[make][model]) return [];
  return motorcycleDatabase[make][model].years;
};

export const getMotorcycleInfo = (make, model) => {
  if (!make || !model || !motorcycleDatabase[make] || !motorcycleDatabase[make][model]) return null;
  return motorcycleDatabase[make][model];
};

// Search function to find motorcycles by various criteria
export const searchMotorcycles = (criteria) => {
  const results = [];
  
  Object.keys(motorcycleDatabase).forEach(make => {
    Object.keys(motorcycleDatabase[make]).forEach(model => {
      const info = motorcycleDatabase[make][model];
      
      // Check if motorcycle matches search criteria
      let matches = true;
      
      if (criteria.category && info.category !== criteria.category) matches = false;
      if (criteria.type && info.type !== criteria.type) matches = false;
      if (criteria.minYear && Math.min(...info.years) < criteria.minYear) matches = false;
      if (criteria.maxYear && Math.max(...info.years) > criteria.maxYear) matches = false;
      if (criteria.make && make.toLowerCase() !== criteria.make.toLowerCase()) matches = false;
      
      if (matches) {
        results.push({
          make,
          model,
          ...info
        });
      }
    });
  });
  
  return results;
};

// Get all available categories
export const getCategories = () => {
  const categories = new Set();
  Object.values(motorcycleDatabase).forEach(make => {
    Object.values(make).forEach(model => {
      categories.add(model.category);
    });
  });
  return Array.from(categories).sort();
};

// Get all available types
export const getTypes = () => {
  const types = new Set();
  Object.values(motorcycleDatabase).forEach(make => {
    Object.values(make).forEach(model => {
      types.add(model.type);
    });
  });
  return Array.from(types).sort();
};

export default motorcycleDatabase;
