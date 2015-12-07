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
                            mdMainColors.push(obj[tint]);
                        }
                    }
                }
            }
        }
    }

    // color keys ... some from tinycolor...
    function colorKeys(baseColor) {
        $("div.cTable").empty();
        cTable("MD Main", baseColor, "usearray", mdMainColors);
        cTable("Monochromatic", baseColor, "monochromatic");
        cTable("Analogous", baseColor, "analogous");
        cTable("Complement", baseColor, "complement");
        cTable("Split Complement", baseColor, "splitcomplement");
        cTable("Triad", baseColor, "triad");
        cTable("Tetrad", baseColor, "tetrad");
    }

    // do the cTable fills...
    function cTable(title, baseColor, action, cArray) {
        var tiny = tinycolor(baseColor);
        var aList;
        var rowLimit = 10;
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
            case ("complement"):
                var tmpList = [];
                aList = tmpList;
                aList.push(tiny);
                aList.push(tiny.complement());
                break;
            case ("splitcomplement"):
                aList = tiny.splitcomplement();
                break;
            case ("usearray"):
                // recursion to correct-length rows...
                if (cArray.length > rowLimit) {
                    // tmpList receives remaining items over sets of rowLimit..
                    var r = (cArray.length % rowLimit);
                    r = r == 0 ? rowLimit : r;
                    var tmpList = cArray.slice(cArray.length - r);
                    // tempList2 receives elements before those removed above rowLimit...
                    var tmpList2 = cArray.slice(0, cArray.length - r);
                    cTable(title, baseColor, "usearray", tmpList2);
                    aList = tmpList.map(tinycolor);
                }
                else {
                    aList = cArray.map(tinycolor);
                }
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
            s += "<th data-rgb=\"" + aList[i].toHexString() + "\">" + aList[i].toHexString() + "</t>";
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
    $('.cTable').on('click', 'td', function(e) {
        out.value = $(this).data("rgb");
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
            h1.innerHTML = tmp[1] + " (" + tmp[2] + ")<br>" + tmp[1].toLowerCase() + " " + tmp[3];
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
                        tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) + Math.pow(((clr.g - anRGB["g"])), 2) + Math.pow(((clr.b - anRGB["b"])), 2));
                        if (tDiff < diff) {
                            diff = tDiff;
                            closest = [anRGB["r"], anRGB["g"], anRGB["b"], key, tint];
                        }
                    }
                }
            }
        }
        // rgb, keyColor, tinkColor, izeLabel...
        return ([Raphael.rgb(closest[0], closest[1], closest[2]), closest[3], closest[4], mdColors.ize[closest[4]]]);
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
