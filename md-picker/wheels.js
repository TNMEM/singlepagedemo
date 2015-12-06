Raphael(function() {
    // get the elements...
    var initialColor = "#f44336";
    var out = document.getElementById("output"),
        vr = document.getElementById("vr"),
        vg = document.getElementById("vg"),
        vb = document.getElementById("vb"),
        vh = document.getElementById("vh"),
        vh2 = document.getElementById("vh2"),
        vs = document.getElementById("vs"),
        vs2 = document.getElementById("vs2"),
        vv = document.getElementById("vv"),
        vl = document.getElementById("vl"),
        h1 = document.getElementById("h1"),
        mdc = document.getElementById("mdColors"),
        mdm = document.getElementById("mdMain"),
        // create colorpicker...
        cp = Raphael.colorpicker(40, 20, 300, initialColor),
        cp2 = Raphael.colorwheel(360, 20, 300, initialColor),
        clr = Raphael.color(initialColor);
    // set initial values...
    out.value = initialColor;
    vr.innerHTML = clr.r;
    vg.innerHTML = clr.g;
    vb.innerHTML = clr.b;
    vh.innerHTML = vh2.innerHTML = Math.round(clr.h * 360) + "°";
    vs.innerHTML = vs2.innerHTML = Math.round(clr.s * 100) + "%";
    vv.innerHTML = Math.round(clr.v * 100) + "%";
    vl.innerHTML = Math.round(clr.l * 100) + "%";
    h1.innerHTML = "Color Picker";

    // get the json file with the material design mdColors...
    var mdColors;
    (function() {
        var gc = $.ajax({
            type: 'GET',
            url: "md-colors.json",
            dataType: 'json'
        });
        gc.fail(function(xhr, type) {
            console.log('gc.fail:');
            console.log(xhr, type);
        });
        gc.done(function(response) {
            console.log('gc.done:');
            console.log(response);
            mdColors = response;
            justMdMainColors();
            colorKeys(initialColor);
        });
    })();

    // get the mdMainColors...
    // called the first time from ajax done.
    var mdMainColors = [];

    function justMdMainColors() {
        var key, obj, tint;
        for (key in mdColors) {
            if (mdColors.hasOwnProperty(key)) {
                obj = mdColors[key];
                for (tint in obj) {
                    if (obj.hasOwnProperty(tint)) {
                        if (tint.substr(0, 4) == "P500") {
                            mdMainColors.push(obj[tint]);
                            //alert(obj[tint]);
                        }
                    }
                }
            }
        }
    }

    // color keys from tinycolor ...
    function colorKeys(baseColor) {
        cTable("Material Design", baseColor, "usearray", mdMainColors);
        cTable("Triad", baseColor, "triad");
        cTable("Tetrad", baseColor, "tetrad");
        cTable("Monochromatic", baseColor, "monochromatic");
        cTable("Analogous", baseColor, "analogous");
        cTable("Split Complement", baseColor, "splitcomplement");
    }

    // do the cTable fills...
    function cTable(title, baseColor, action, cArray) {
        var tiny = tinycolor(baseColor);
        var aList;
        switch (action) {
            case ("triad"):
                aList = tiny.triad();
                break;
            case ("tetrad"):
                aList = tiny.tetrad();
                break;
            case ("monochromatic"):
                aList = tiny.monochromatic();
                break;
            case ("analogous"):
                aList = tiny.analogous();
                break;
            case ("splitcomplement"):
                aList = tiny.splitcomplement();
                break;
            case ("usearray"):
                //console.log("cArray entry: ", cArray);
                if (cArray.length > 12) {
                    var tmpList = cArray.slice();
                    tmpList.splice(12);
                    cArray.splice(0, 12);
                    //console.log("tmplist splice: ", cArray);
                    //console.log("cArray test: ", cArray);
                    cTable(title, baseColor, "usearray", tmpList);
                }
                aList = cArray.map(tinycolor);
                break;
            default:
                break;
        }
        var i, s;
        s = "<table><tr><th>" + title + "</th>";
        for (i = 0; i < aList.length; i++) {
            s += "<td bgcolor=\"" + aList[i].toHexString() + "\" data-rgb=\"" + aList[i].toHexString() + "\"></td>";
        }
        s += "</tr><tr><th></th>";
        for (i = 0; i < aList.length; i++) {
            s += "<td data-rgb=\"" + aList[i].toHexString() + "\">" + aList[i].toHexString() + "</td>";
        }
        s += "</tr></table>";
        $("div.cTable").append(s);
        //console.log(aList);
        //console.log(aList.map(function(f) {
        //    return f.toHexString();
        //}));
    }

    // handle click on color keys / cTable elements "TD" elevents...
    $('.cTable').on('click', 'td', function(e) {
        out.value = $(this).data("rgb");
    });

    // onchange event handler...
    var onchange = function(item) {
        return function(clr) {
            //console.log("onchange:");
            //console.log(clr);
            clr = checkCalcColor(clr);
            item.color(clr);
            setDials(clr);
        };
    };
    // handle color pickers...
    cp.onchange = onchange(cp2);
    cp2.onchange = onchange(cp);

    // handle hex/name box...
    out.onkeypress = function(event) {
        // trigger on enter key...
        var x = event.which || event.keyCode;
        if (x == 13) {
            clr = checkCalcColor(this.value);
            cp.color(clr);
            cp2.color(clr);
            setDials(clr);
        }
    };

    // little helper to name mdColors into h1.innerHTML...
    function nameColor(base, tint) {
        var s;

        s = base + " (" + tint + ")<br>" + base.toLowerCase() + " ";
        switch (tint) {
            case "P50":
                s += "lighten-5";
                break;
            case "P100":
                s += "lighten-4";
                break;
            case "P200":
                s += "lighten-3";
                break;
            case "P300":
                s += "lighten-2";
                break;
            case "P400":
                s += "lighten-1";
                break;
            case "P500":
                s += "";
                break;
            case "P600":
                s += "darken-1";
                break;
            case "P700":
                s += "darken-2";
                break;
            case "P800":
                s += "darken-3";
                break;
            case "P900":
                s += "darken-4";
                break;
            case "A100":
                s += "accent-1";
                break;
            case "A200":
                s += "accent-2";
                break;
            case "A400":
                s += "accent-3";
                break;
            case "A500":
                s += "accent-4";
                break;
            default:
                s += "Unknown";
        }
        return s;
    }

    // filter the check boxes to see how to handle color and settings...
    function checkCalcColor(clr) {
        if (mdc.checked == true) {
            // returns array of [rgbString, mdColorName, mdTinkNumber]...
            var tmp = calcColor(clr);
            clr = tmp[0];
            //h1.innerHTML = tmp[1] + " (" + tmp[2] + ")";
            h1.innerHTML = nameColor(tmp[1], tmp[2]);
            cp.color(clr);
            cp2.color(clr);
        }
        else {
            h1.innerHTML = "Color Picker";
            // don't need this since no color changes...
            //cp.color(clr);
            //cp2.color(clr);
        }
        return clr;
    }

    // calculate closest color based on material color design: just primaries or all...
    function calcColor(clr) {
        //console.log("calcColor: ", clr);
        clr = Raphael.color(clr);
        //console.log(clr);
        var diff = Number.MAX_VALUE;
        var tDiff, closest, obj, key, tint, anRGB;
        for (key in mdColors) {
            if (mdColors.hasOwnProperty(key)) {
                obj = mdColors[key];
                for (tint in obj) {
                    if (obj.hasOwnProperty(tint)) {
                        // need to fix this ... always searches all mdColors...
                        if (mdm.checked == true && tint.substr(0, 4) == "P500") {
                            anRGB = Raphael.getRGB(obj[tint]);
                        }
                        else if (mdm.checked == false /*&& tint.substr(0, 1) == "A" */ ) {
                            anRGB = Raphael.getRGB(obj[tint]);
                        }
                        else {
                            continue;
                        }
                        //console.log("A Color: ", key, tint, obj[tint]);
                        tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) + Math.pow(((clr.g - anRGB["g"])), 2) + Math.pow(((clr.b - anRGB["b"])), 2));
                        //console.log("compare: ", anRGB["r"] + " " + anRGB["g"] + " " + anRGB["b"]);
                        //console.log("tDiff: ", tDiff);
                        if (tDiff < diff) {
                            diff = tDiff;
                            closest = [anRGB["r"], anRGB["g"], anRGB["b"], key, tint];
                            //console.log("replaced:");
                            //console.log(closest);
                        }
                    }
                }
            }
        }
        return ([Raphael.rgb(closest[0], closest[1], closest[2]), closest[3], closest[4]]);
    }

    // twist the little readouts...
    function setDials(clr) {
        out.value = clr.replace(/^#(.)\1(.)\2(.)\3$/, "#$1$2$3");
        //out.style.background = clr;
        out.style.background = "white";
        //out.style.color = Raphael.rgb2hsb(clr).b < .5 ? "#fff" : "#000";
        out.style.color = "black";
        clr = Raphael.color(clr);
        vr.innerHTML = clr.r;
        vg.innerHTML = clr.g;
        vb.innerHTML = clr.b;
        vh.innerHTML = vh2.innerHTML = Math.round(clr.h * 360) + "°";
        vs.innerHTML = vs2.innerHTML = Math.round(clr.s * 100) + "%";
        vv.innerHTML = Math.round(clr.v * 100) + "%";
        vl.innerHTML = Math.round(clr.l * 100) + "%";
    }
});
