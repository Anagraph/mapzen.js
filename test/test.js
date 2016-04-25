before(function() {
   console.log('Leaflet version: ' + L.version);
})

describe('leaflet', function() {
  //jsdom();
  var el;
  var map;

  beforeEach('initialize map', function () {
    el = document.createElement('div');
    // DOM needs to be visible: appended to the body and have dimensions
    // in order for .focus() to work properly
    el.style.cssText = 'position: absolute; left: 0; top: 0; width: 100%; height: 100%;';
    document.body.appendChild(el);
    map = L.map(el);
  });

  it('check which Leaflet version it is', function() {
    expect(L.version).to.equal('0.7.7');
  });

  it('check that zoom is being set',function(){
    map.setView([51.505, -0.09], 13);
    expect(map.getZoom()).to.eq(13);
    console.log(WebMap.draw())
  });

});
