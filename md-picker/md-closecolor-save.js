//added lou king ... find closet matching "allowed" color
// returns: Raphael color
var grabClosestColor = function(r, g, b) {
    //console.log("grab vals: ", r + " " + g + " " + b);
    var colors = {
        "Red": {
            "P50": "#ffebee",
            "P100": "#ffcdd2",
            "P200": "#ef9a9a",
            "P300": "#e57373",
            "P400": "#ef5350",
            "P500": "#f44336",
            "P600": "#e53935",
            "P700": "#d32f2f",
            "P800": "#c62828",
            "P900": "#b71c1c",
            "A100": "#ff8a80",
            "A200": "#ff5252",
            "A400": "#ff1744",
            "A700": "#d50000"
        },
        "Pink": {
            "P50": "#fce4ec",
            "P100": "#f8bbd0",
            "P200": "#f48fb1",
            "P300": "#f06292",
            "P400": "#ec407a",
            "P500": "#e91e63",
            "P600": "#d81b60",
            "P700": "#c2185b",
            "P800": "#ad1457",
            "P900": "#880e4f",
            "A100": "#ff80ab",
            "A200": "#ff4081",
            "A400": "#f50057",
            "A700": "#c51162"
        }
    };
    var diff = Number.MAX_VALUE;
    var tDiff, closest, obj, key, tint, anRGB;
    
    for (key in colors) {
        if (colors.hasOwnProperty(key)) {
            obj = colors[key];
            for (tint in obj) {
                if (obj.hasOwnProperty(tint)) {
                    console.log("A Color: ", key, tint, obj[tint]);
                    //anRGB = Raphael.getRGB(colors[key].P500);
                    anRGB = Raphael.getRGB(obj[tint]);
                    console.log("anRGB: ", anRGB.hex);
                    tDiff = Math.sqrt(Math.pow(((r - anRGB["r"])), 2) + Math.pow(((g - anRGB["g"])), 2) + Math.pow(((b - anRGB["b"])), 2));
                    //console.log("compare: ", anRGB["r"] + " " + anRGB["g"] + " " + anRGB["b"]);
                    //console.log("tDiff: ", tDiff);
                    if (tDiff < diff) {
                        diff = tDiff;
                        closest = [anRGB["r"], anRGB["g"], anRGB["b"], key];
                        console.log("replaced:");
                        console.log(closest);
                    }
                }
            }
        }
    }
    
    return Raphael.rgb(closest[0], closest[1], closest[2]);
};