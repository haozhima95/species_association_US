var randomim = ee.Image.random().multiply(100000000);

    randomim = randomim.setDefaultProjection({
      crs: 'EPSG:4326',
 	    crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90]
    });
    randomim = randomim.reproject({
      crs:randomim.projection(),
      scale:200000
    });
    randomim = randomim.int()
    
var latlon = ee.Image.pixelLonLat();
    latlon = latlon.setDefaultProjection({
      crs: 'EPSG:4326',
 	    crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90]
    });
    latlon = latlon.reproject({
      crs:latlon.projection(),
      scale:200000
    });

print(randomim.projection())


Map.addLayer(randomim);

  var lon = latlon.select([0]);
      lon = lon.rename('cell_lon')
  var lat = latlon.select([1]);
      lat = lat.rename('cell_lat');

Map.addLayer(latlon);


// Load fia plots

var gfbi = ee.FeatureCollection('users/haozhima95/fia_plots');
Map.addLayer(gfbi)

var comp = ee.Image('users/leonidmoore/ForestBiomass/20200915_Forest_Biomass_Predictors_Image');
    comp = comp.addBands(randomim);
    comp = comp.addBands(lon);
    comp = comp.addBands(lat);
// print(comp);




var sample = gfbi.map(function(f){
  var ss = comp.sampleRegions({
    collection:f,
    scale:1000,
    tileScale:16,
    geometries:true
  });
  return ss;
});


    sample = sample.flatten();
    // sample = sample.filterMetadata('species_richness', 'not_less_than', 2);
print(sample.limit({
  max:7,
  ascending:false
}));


Export.table.toAsset({
  collection:sample,
  description:'fia_with_20fishnet_20240603'
});


Export.table.toDrive({
  collection:sample,
  description:'fia_with_200fishnet_20240603',
  fileFormat:'CSV'
});


