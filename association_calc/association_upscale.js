var randomim = ee.Image.random().multiply(100000000);

    randomim = randomim.setDefaultProjection({
      crs: 'EPSG:4326',
 	    crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90]
    });
    randomim = randomim.reproject({
      crs:randomim.projection(),
      scale:50000
    });

print(randomim.projection().getInfo());

var df = ee.FeatureCollection('users/haozhima95/grid_level_association_50km_sig_180s_20240606_reserved_nocover');


Map.addLayer(df);

print(df.limit(3));



var tempstd = df.reduceToImage({
properties:['CHELSA_Annual_Mean_Temperature_std'],
reducer:ee.Reducer.first()
});

 tempstd = tempstd.reproject(randomim.projection())

var prestd = df.reduceToImage({
 properties:['CHELSA_Annual_Precipitation_std'],
 reducer:ee.Reducer.first()
});

   prestd = prestd.reproject(randomim.projection())

var elestd = df.reduceToImage({
 properties:['EarthEnvTopoMed_Elevation_std'],
 reducer:ee.Reducer.first()
});

   elestd = elestd.reproject(randomim.projection())



var asso = df.reduceToImage({
  properties:['assosimple'],
  reducer:ee.Reducer.first()
});
    asso = asso.reproject(randomim.projection())

var assogen = df.reduceToImage({
  properties:['assogen'],
  reducer:ee.Reducer.first()
});
    assogen = assogen.reproject(randomim.projection())



var assospear = df.reduceToImage({
  properties:['associatoinsimplespear'],
  reducer:ee.Reducer.first()
});
    assospear = assospear.reproject(randomim.projection())


var assosr = df.reduceToImage({
  properties:['associationsr'],
  reducer:ee.Reducer.first()
});
    assosr = assosr.reproject(randomim.projection())

var assopvalue = df.reduceToImage({
  properties: ['associationpvalue'],
  reducer: ee.Reducer.first()
});

    assopvalue = assopvalue.reproject(randomim.projection());

var nplot = df.reduceToImage({
  properties: ['nplot'],
  reducer: ee.Reducer.first()
});

    nplot = nplot.reproject(randomim.projection());
    nplot = nplot.mask(nplot.gt(0));



var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000', '790000'];
var vis = {min:-0.4, max:0, palette: colors};


Map.addLayer(asso, vis);
Map.addLayer(assogen, vis);

var diff = asso.subtract(assogen);

Map.addLayer(diff,vis)



var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000', '790000'];
var vis = {min:0, max:0.06, palette: colors};


Map.addLayer(assosr, vis);


var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000', '790000'];
var vis = {min:0, max:0.05, palette: colors};


Map.addLayer(assopvalue, vis);


var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000', '790000'];
var vis = {min:20, max:500, palette: colors};


Map.addLayer(nplot, vis);




var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

Export.image.toDrive({
  image:asso,
  description:'association_mean_us_200km_sig_180s_grids_20240701_nosig',
  region:unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[1.7966305682390429, 0, -180, 0, 1.7966305682390429, 90],
  maxPixels: 1e13
});


Export.image.toDrive({
  image:assogen,
  description:'association_mean_us_50km_sig_180s_grids_20240630_nosig_gen',
  region:unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
  maxPixels: 1e13
});


Export.image.toDrive({
  image:diff,
  description:'association_gen_difference',
  region:unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
  maxPixels: 1e13
});




Export.image.toCloudStorage({
  image:assospear,
  description:'association_spear_mean_us_50km_sig_180s_grids_20240404_nosig',
  region:unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
  maxPixels: 1e13,
 	bucket:'haozhi_ma'
});



Export.image.toDrive({
  image:assosr,
  description:'assosr_us_50km_sig_grids_20240702_nosig',
  region:unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
  maxPixels: 1e13
});

Export.image.toCloudStorage({
 image:tempstd,
 description:'tempstd_us_50km_sig_grids_20240116',
 region:unboundedGeo,
 crs:'EPSG:4326',
 crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
 maxPixels: 1e13,
	bucket:'haozhi_ma'
 });

 Export.image.toCloudStorage({
   image:prestd,
   description:'prestd_us_50km sig_grids_20240116',
   region:unboundedGeo,
   crs:'EPSG:4326',
   crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
   maxPixels: 1e13,
 	bucket:'haozhi_ma'
 });

Export.image.toCloudStorage({
   image:elestd,
   description:'elestd_us_50km sig_grids_20240116',
   region:unboundedGeo,
   crs:'EPSG:4326',
   crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
   maxPixels: 1e13,
 	bucket:'haozhi_ma'
 });


Export.image.toDrive({
  image:assopvalue,
  description:'assopvalue_us_50km_sig_grids_20240701_nosig',
  region:unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
  maxPixels: 1e13
});



Export.image.toDrive({
  image:nplot,
  description:'nplot_us_50km_sig_grids_180s_20240626_nosig',
  region:unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.4491576420597607, 0, -180, 0, 0.4491576420597607, 90],
  maxPixels: 1e13
});
