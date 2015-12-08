Raphael(function() {
    // get the elements...
    var initialColor = "#f44336";
    var currentFamilyMdColor = "Red";
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
        mdc = document.getElementById("mdColorsChk"),
        mdm = document.getElementById("mdMainChk"),
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

    // get the json file with the material design mdColors
    // ... this is a javascript object ...
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

    // get the mdMainColors
    // ... this is a simple javascript array...
    var mdMainColors = [];

    function justMdMainColors() {
        var key, obj, tint;
        for (key in mdColors.md) {
            if (mdColors.md.hasOwnProperty(key)) {
                obj = mdColors.md[key];
                for (tint in obj) {
                    if (obj.hasOwnProperty(tint)) {
                        if (tint.substr(0, 4) == "P500") {
                            mdMainColors.push([obj[tint], key + " (" + tint + ") materializecss: " + key.toLowerCase() + " " + mdColors.ize[tint]]);
                        }
                    }
                }
            }
        }
    }

    // get all the items in a family like "Red"...
    function justFamilyMdColors(colorName) {
        var key, obj, tint;
        var a = [];
        for (key in mdColors.md) {
            if (mdColors.md.hasOwnProperty(key)) {
                obj = mdColors.md[key];
                for (tint in obj) {
                    if (obj.hasOwnProperty(tint)) {
                        if (key == colorName) {
                            a.push([obj[tint], key + " (" + tint + ") materializecss: " + key.toLowerCase() + " " + mdColors.ize[tint]]);
                        }
                    }
                }
            }
        }
        return a;
    }

    // expects an an array of [tinycolor, "description"]
    // return new array of near-match Md colors...
    function matchMd(c) {
        x = jQuery.map(c, function(n, i) {
            y = [ calcColor(tinycolor(n[0]).toRgb()) ];
            return y;
        });
        console.log("x: ", x);
        return x;
    }
    
    // color keys ... some from tinycolor...
    function colorKeys(baseColor) {
        $("div.cTable").empty();

        $("div.cTable").append(
            "<p>Click any color to change the base color used in combinations.</p>"
        );

        $("div.cTable").append("<h4>Google Material Design main '500' colors</h4>");
        cTable("MD", baseColor, "mdarray", mdMainColors);
        cTable("MD " + currentFamilyMdColor, baseColor, "mdarray", justFamilyMdColors(currentFamilyMdColor));

        $("div.cTable").append("<h4>Standard combinations</h4>");
        cTable("Monochromatic", baseColor, "monochromatic");
        cTable("Analogous", baseColor, "analogous");
        cTable("Complement", baseColor, "complement");
        cTable("Split Complement", baseColor, "splitcomplement");
        cTable("Triad", baseColor, "triad");
        cTable("Tetrad", baseColor, "tetrad");
    }

    // do the cTable fills ... arrays expected [rgb, description] ...
    function cTable(title, baseColor, action, cArray) {
        var tiny = tinycolor(baseColor);
        var aList;
        var rowLimit = 10;
        switch (action) {
            case ("triad"):
                aList = tiny.triad();
                aList = aList.map(function(rgb) {
                    return [rgb, ""];
                });
                // convert array to md colors and send it to mdarray handler...
                cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                break;
            case ("tetrad"):
                aList = tiny.tetrad();
                aList = aList.map(function(rgb) {
                    return [rgb, ""];
                });
                // convert array to md colors and send it to mdarray handler...
                cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                break;
            case ("monochromatic"):
                aList = tiny.monochromatic();
                aList = aList.map(function(rgb) {
                    return [rgb, ""];
                });
                // convert array to md colors and send it to mdarray handler...
                cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                break;
            case ("analogous"):
                aList = tiny.analogous();
                aList = aList.map(function(rgb) {
                    return [rgb, ""];
                });
                // convert array to md colors and send it to mdarray handler...
                cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                break;
            case ("complement"):
                aList = [];
                aList.push(tiny);
                aList.push(tiny.complement());
                aList = aList.map(function(rgb) {
                    return [rgb, ""];
                });
                // convert array to md colors and send it to mdarray handler...
                cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                break;
            case ("splitcomplement"):
                aList = tiny.splitcomplement();
                aList = aList.map(function(rgb) {
                    return [rgb, ""];
                });
                // convert array to md colors and send it to mdarray handler...
                cTable(title + " MD", baseColor, "mdarray", matchMd(aList));
                break;
            case ("mdarray"):
                // recursion to correct-length rows...
                if (cArray.length > rowLimit) {
                    // tmpList receives remaining items over sets of rowLimit..
                    var r = (cArray.length % rowLimit);
                    r = r == 0 ? rowLimit : r;
                    var tmpList = cArray.slice(cArray.length - r);
                    // tempList2 receives elements before those removed above rowLimit...
                    var tmpList2 = cArray.slice(0, cArray.length - r);
                    cTable(title, baseColor, "mdarray", tmpList2);
                    aList = jQuery.map(tmpList, function(n, i) {
                        return [
                            [tinycolor(n[0]), n[1]]
                        ];
                    });
                    //aList = tmpList.map(tinycolor);
                }
                else {
                    aList = jQuery.map(cArray, function(n, i) {
                        return [
                            [tinycolor(n[0]), n[1]]
                        ];
                    });
                    //aList = cArray.map(tinycolor);
                }
                break;
            default:
                break;
        }
        var i, s;
        s = "<table><tr><td>" + title + "</td>";
        for (i = 0; i < aList.length; i++) {
            s += "<th title=\"" + aList[i][1] + "\" bgcolor=\"" + aList[i][0].toHexString() + "\" data-rgb=\"" + aList[i][0].toHexString() + "\"></th>";
        }
        s += "</tr><tr><td></td>";
        for (i = 0; i < aList.length; i++) {
            s += "<td data-rgb=\"" + aList[i][0].toHexString() + "\">" + aList[i][0].toHexString() + "</td>";
        }
        s += "</tr></table>";
        $("div.cTable").append(s);
    }

    // onchange event handler...
    var onchange = function(item) {
        return function(clr) {
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

    // handle click on color keys / cTable elements "TD" elevents...
    $('.cTable').on('click', 'th', function(e) {
        // if "title" has a space, then it's Md color needing Family key...
        var x = $(this).attr("title");
        if (x.length > 0) {
            currentFamilyMdColor = x.split(" ")[0];
        }
        // set the new "out" value...
        out.value = $(this).data("rgb");
        // trigger "out" control...
        var event = jQuery.Event('keypress');
        event.which = 13;
        event.keyCode = 13;
        jQuery("#output").trigger(event);
    });

    // filter the check boxes to see how to handle color and settings...
    function checkCalcColor(clr) {
        if (mdc.checked == true) {
            // returns array of [rgbString, mdColorName, mdTinkNumber]...
            var tmp = calcColor(clr);
            clr = tmp[0];
            h1.innerHTML = tmp[1];
            cp.color(clr);
            //cp2.color(clr);
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
        clr = Raphael.color(clr);
        var diff = Number.MAX_VALUE;
        var tDiff, closest, obj, key, tint, anRGB;
        for (key in mdColors.md) {
            if (mdColors.md.hasOwnProperty(key)) {
                obj = mdColors.md[key];
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
                        // unweighted rgb...
                        //tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) + Math.pow(((clr.g - anRGB["g"])), 2) + Math.pow(((clr.b - anRGB["b"])), 2));
                        // weighted rgb...
                        //tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) * 3 + Math.pow(((clr.g - anRGB["g"])), 2) * 4 + Math.pow(((clr.b - anRGB["b"])), 2) * 2);
                        // special calc...
                        tDiff = colorDistance(clr, anRGB);
                        if (tDiff < diff) {
                            diff = tDiff;
                            closest = [anRGB["r"], anRGB["g"], anRGB["b"], key, tint];
                        }
                    }
                }
            }
        }
        // rgb, keyColor, tinkColor, izeLabel...
        //return ([Raphael.rgb(closest[0], closest[1], closest[2]), closest[3], closest[4], mdColors.ize[closest[4]]]);
        return ([Raphael.rgb(closest[0], closest[1], closest[2]), closest[3] + " (" + closest[4] + ") materializecss: " + closest[3].toLowerCase() + " " + mdColors.ize[closest[4]]]);
    }

    // http://www.compuphase.com/cmetric.htm
    // ... very mathy and follows human perception...
    function colorDistance(e1, e2) {
        var e1 = tinycolor(e1).toRgb();
        var e2 = tinycolor(e2).toRgb();
        var rmean = (e1.r + e2.r) / 2;
        var r = e1.r - e2.r;
        var g = e1.g - e2.g;
        var b = e1.b - e2.b;

        return Math.sqrt((((512 + rmean) * r * r) / 256) + 4 * g * g + (((767 - rmean) * b * b) / 256));
    }

    // twist the little readouts...
    function setDials(clr) {
        out.value = clr.replace(/^#(.)\1(.)\2(.)\3$/, "#$1$2$3");
        //out.style.background = clr;
        out.style.background = "white";
        //out.style.color = Raphael.rgb2hsb(clr).b < .5 ? "#fff" : "#000";
        out.style.color = "black";

        colorKeys(clr);

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
