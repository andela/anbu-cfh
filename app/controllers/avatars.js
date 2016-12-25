/**
 * List of Avatars
 */
avatars = ['/img/chosen/shin.gif',
  '/img/chosen/labrat.gif',
  '/img/chosen/jennifer.gif',
  '/img/chosen/luther.gif',
  '/img/chosen/camile.gif',
  '/img/chosen/grace.gif',
  '/img/chosen/abby.gif',
  '/img/chosen/iranir.gif',
  '/img/chosen/astro.gif',
  '/img/chosen/alfred.gif',
  '/img/chosen/dudai.gif',
  '/img/chosen/general.gif',
  '/img/chosen/andina.kay.gif',
  '/img/chosen/eduardo.gif',
  '/img/chosen/dorothy.gif',
  '/img/chosen/rainbowness.gif'
];

exports.allJSON = function (req, res) {
  // Only return the first 12
  // The last 4 are reserved for guests
  res.jsonp(avatars.slice(0, 12));
};

exports.all = function () {
  return avatars;
};
