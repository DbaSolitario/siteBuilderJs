function clean() {
    $(".box").empty();
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function saveStaticDataToFile() {
    var data = $(".container-fluid")[0].innerHTML;
    var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "code.html");
}

function reset() {
    $("#idTxt").hide();
    $("#idTxt").val("");
    $("#width").val("150")
    $("#height").val("150")
    $("#txt").val("")
    $("#classTxt").val("")
    $("#thickness").val("")
    $("#radius").val("")
    $("#colorPick").val("#000000")
    $("#colorPickBorder").val("#000000")

    $(".selected").each((index, item) => {
        $(item).removeClass("selected")
    })
}


$(document).ready(function() {

    reset()

    function checkKey(e) {
        e = e || window.event;
        if ($("#idTxt").val() != "") {
            var item = $("#" + $("#idTxt").val())
            if (item != undefined) {
                item = item[0];
                var left = item.style.left;
                left = parseFloat(left.substring(0, left.length - 1))
                var top = item.style.top;
                top = parseFloat(top.substring(0, top.length - 1))

                if (e.keyCode == '38') {
                    item.style.top = (top - 0.1) + "%"
                } else if (e.keyCode == '40') {
                    item.style.top = (top + 0.1) + "%"
                } else if (e.keyCode == '37') {
                    item.style.left = (left - 0.1) + "%"
                } else if (e.keyCode == '39') {
                    item.style.left = (left + 0.1) + "%"
                }
            }
        }

    }

    document.onkeydown = checkKey;

    $(".drop-targets").on('click', function(e) {
        if (e.target.classList.contains("box"))
            reset()
    });

    document.getElementById("itensListCreated").addEventListener("mouseover", function(e) {
        if ($(`#${e.target.innerHTML}`) != null && $(`#${e.target.innerHTML}`) != undefined) {
            itemClick(e)

        }
    })

    /* draggable element */
    const item = document.querySelector('.item');
    const startItem = document.querySelector('.startItem');

    startItem.addEventListener('dragstart', dragStart);

    function dragStart(e) {

        var xInit = 0,
            yInit = 0

        if (document.getElementById(e.target.id) != null) {
            xInit = document.getElementById(e.target.id).getBoundingClientRect().x;
            yInit = document.getElementById(e.target.id).getBoundingClientRect().y;

        }

        var data = {
            id: e.target.id,
            xClick: e.clientX,
            yClick: e.clientY,
            xInit: xInit,
            yInit: yInit,
        }

        e.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    /* drop targets */
    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
        box.addEventListener('dragenter', dragEnter)
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });

    function dragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function dragOver(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function calcPercentage(x, size) {
        return (x / size * 100)
    }

    function drop(e) {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const draggable = document.getElementById(data.id);

        //Lógica para quando soltar deixar no mesmo lugar que foi clicado
        var diffX = (e.pageX + (data.xInit - data.xClick)) > 0 ? e.pageX + (data.xInit - data.xClick) : 2;
        var diffY = (e.pageY + (data.yInit - data.yClick)) > 0 ? e.pageY + (data.yInit - data.yClick) : 2;

        xPercent = calcPercentage(diffX, window.innerWidth);
        yPercent = calcPercentage(diffY, window.innerHeight);

        if (data.id == "start") {
            var item = document.createElement("div")
            item.style.left = xPercent + "%";
            item.style.top = yPercent + "%";
            item.style.position = "fixed";
            item.setAttribute("id", "box_" + xPercent.toFixed(0) + "_" + yPercent.toFixed(0))
            item.setAttribute("draggable", "true")
            item.addEventListener('dragstart', dragStart);
            item.addEventListener('click', itemClick);
            item.style.width = $("#width").val() + "px"
            item.style.height = $("#height").val() + "px"
            var border = $("#thickness").val() + "px " + $("#colorPickBorder").val() + " solid";
            //console.log(border)
            item.style.border = border;
            item.style.borderRadius = $("#radius").val() + "px";
            item.style.backgroundColor = $("#colorPick").val()

            $(".itensListCreated").append(`<li class="item_${item.id}">${item.id}</li>`)

            item.classList.add("item")

            if ($("#classTxt").val() != "") {
                $("#classTxt").val().split(' ').forEach(split => {
                    item.classList.add(split)
                })
            }

            item.innerHTML = $("#txt").val()
            e.target.appendChild(item);
        } else {
            //Changing left and right information
            draggable.style.left = xPercent + "%";
            draggable.style.top = yPercent + "%";
            $(`.item_${draggable.id}`).remove()
            draggable.setAttribute("id", "box_" + xPercent.toFixed(0) + "_" + yPercent.toFixed(0))

            $(".itensListCreated").append(`<li class="item_${draggable.id}">${draggable.id}</li>`)

            draggable.addEventListener('dragstart', dragStart);
            if (draggable != e.target)
                e.target.appendChild(draggable);
            if (draggable.hasChildNodes && draggable != e.target) {
                var diffW = calcPercentage(diffX - data.xInit, window.innerWidth);
                var diffH = calcPercentage(diffY - data.yInit, window.innerHeight);
                setNewLeftTop(draggable, diffW, diffH)
            }
        }
    }

    function setNewLeftTop(draggable, diffW, diffH) {
        draggable.childNodes.forEach(item => {
            var left = item.style.left;
            left = parseFloat(left.substring(0, left.length - 1))
            var top = item.style.top;
            top = parseFloat(top.substring(0, top.length - 1))
            item.style.left = (left + diffW) + "%";
            item.style.top = (top + diffH) + "%";
            item.setAttribute("id", "box_" + (left + diffW).toFixed(0) + "_" + (top + diffH).toFixed(0))
            if (item.hasChildNodes && item != draggable)
                setNewLeftTop(item, diffW, diffH)
        })
    }

    function selectedItemChange() {
        if ($("#idTxt").val() != null && $("#idTxt").val() != "") {
            var item = $("#" + $("#idTxt").val())
            if (item != undefined) {
                item = item[0];
                item.style.width = $("#width").val() + "px";
                item.style.height = $("#height").val() + "px";
                item.style.backgroundColor = $("#colorPick").val();
                item.innerHTML = $("#txt").val()
                var border = $("#thickness").val() + "px " + $("#colorPickBorder").val() + " solid";
                //console.log(border)
                item.style.border = border;
                item.style.borderRadius = $("#radius").val() + "px";
                if ($("#classTxt").val() != "") {
                    $("#classTxt").val().split(' ').forEach(split => {
                        item.classList.add(split)
                    })
                }
            }
        }
    }

    function itemClick(e) {

        $(".selected").each((index, item) => {
            $(item).removeClass("selected")
        })

        var item = document.getElementById(e.target.id)

        if (item == undefined)
            item = document.getElementById(e.target.innerHTML)

        $("#width").val(item.style.width.substring(0, item.style.width.length - 2));
        $("#height").val(item.style.height.substring(0, item.style.height.length - 2));
        var itemBgd = item.style.backgroundColor.substring(4, item.style.backgroundColor.length - 1).split(',');
        $("#colorPick").val(rgbToHex(parseInt(itemBgd[0].replace(/\s/g, '')), parseInt(itemBgd[1].replace(/\s/g, '')), parseInt(itemBgd[2].replace(/\s/g, ''))))
        if (item.style.borderColor != "") {
            console.log(item.style.borderWidth)
            var borderBgd = item.style.borderColor.substring(4, item.style.borderColor.length - 1).split(',');
            $("#colorPickBorder").val(rgbToHex(parseInt(borderBgd[0].replace(/\s/g, '')), parseInt(borderBgd[1].replace(/\s/g, '')), parseInt(borderBgd[2].replace(/\s/g, ''))))
            $("#thickness").val(item.style.borderWidth.substring(0, item.style.borderWidth.length - 2))
            $("#radius").val(item.style.borderRadius.substring(0, item.style.borderRadius.length - 2))
        } else {
            $("#thickness").val("")
            $("#radius").val("")
        }

        //$("#txt").val(item.innerHTML)
        $("#classTxt").val(item.classList.toString())
        $("#idTxt").val(item.id);
        $("#idTxt").hide();

        item.classList.add("selected");

        document.getElementById("width").addEventListener("change", selectedItemChange);
        document.getElementById("height").addEventListener("change", selectedItemChange);
        document.getElementById("colorPick").addEventListener("change", selectedItemChange);
        document.getElementById("txt").addEventListener("change", selectedItemChange);
        document.getElementById("classTxt").addEventListener("change", selectedItemChange);
        document.getElementById("thickness").addEventListener("change", selectedItemChange);
        document.getElementById("colorPickBorder").addEventListener("change", selectedItemChange);
        document.getElementById("radius").addEventListener("change", selectedItemChange);
    }
})