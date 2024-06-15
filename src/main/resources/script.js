class Toilet {
    constructor() {
        this.name = "小東路地下道";
        this.type = "All Gender";
        this.isFree = true;
        this.Longitude = 120.21379292529143;
        this.Latitude = 23.00158213806466;
        this.Status = {
            isAvailable: true,
            isClean: true,
            isPaper: true,
            isSoap: true
        };
        this.set = function set(json) {
            return Object.assign(new Toilet(), json);
        }
    }
}

const map = L.map('map').setView([23, 120.21], 15);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <span aria-hidden="true">|</span> <a href="https://github.com/lynntsuiplus/pd2ToiletProject">GitHub Repo</a>'
}).addTo(map);

var markerLayer = L.featureGroup().addTo(map);
var toiletLayer = L.featureGroup().addTo(map);
var formLayer = L.featureGroup().addTo(map);

var test = "{\
    \"name\": \"南一中校門口\",\
    \"type\": \"Disabled\",\
    \"isFree\": false,\
    \"Longitude\": 120.21557856948613,\
    \"Latitude\": 22.9942663239397,\
    \"Status\": {\
        \"isAvailable\" : false,\
        \"isClean\" : false,\
        \"isPaper\" : false,\
        \"isSoap\" : false\
    }\
}";
var test2 = "{\
    \"values\": [114, 514]\
}";
var test3 = [];

var toiletsAll;
getToiletLocation();

function getToiletLocation() {
    toiletsAll = [];
    /*let url = ""; // fill url here
    fetch(url).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('無法連絡伺服器，請回報開發者');
        }).then((json) => {
            var jsonArray = JSON.parse(json);
            for (var i = 0; i < jsonArray.length; i++) {
                toiletsAll.push(new Toilet.set(jsonArray[i]));
            }
        }).catch((error) => {
            alert(error);
        });
    */

    toiletsAll.push(new Toilet()); // test
    toiletsAll.push(new Toilet().set(JSON.parse(test))); // test
    displayToilet(toiletsAll, null);
}
function getDistance() {
    let distance = [];
    let jsonArray = JSON.parse(test2).values;
    /*let url = ""; // fill url here
    fetch(url).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('無法連絡伺服器，請回報開發者');
        }).then((json) => {
            var jsonArray = JSON.parse(json);
            for (var i = 0; i < jsonArray.length; i++) {
                distance.push(jsonArray[i]);
            }
            return distance;
        }).catch((error) => {
            alert(error);
        });
    */

    for (var i = 0; i < jsonArray.length; i++) { //test
        distance.push(jsonArray[i]);
    }
    return distance;
}
function displayToilet(toilets, distance) {
    var f = 0;
    if (distance != null && Array.isArray(distance) && distance.length == toilets.length) {
        f = 1;
    }
    for (var i = 0; i < toilets.length; i++) {
        let longitude = toilets[i].Longitude;
        let latitude = toilets[i].Latitude;
        let temp = L.marker([latitude, longitude]).addTo(toiletLayer);
        temp.bindPopup(formatPopup(toilets[i], f ? distance[i] : -1));
    }
}
function formatPopup(toilet, toiletDist) {
    let name = toilet.name;
    let type;
    switch (toilet.type) {
        case "All Gender": type = "不分性別"; break;
        case "Male": type = "男廁"; break;
        case "Female": type = "女廁"; break;
        case "Disabled": type = "無障礙廁所"; break;
        default: type = toilet.type;
    }
    let free = toilet.isFree ? "" : "<b>需付費使用</b><br>";
    let available = toilet.Status.isAvailable ? "" : "<b>目前不可用</b><br>";
    let clean = toilet.Status.isClean ? "乾淨整潔" : "整潔欠佳";
    let paper = toilet.Status.isPaper ? "有衛生紙" : "沒有衛生紙";
    let soap = toilet.Status.isSoap ? "有肥皂" : "沒有肥皂";
    let dist = "";
    if (toiletDist >= 0) dist = "距離：" + toiletDist + "m";
    var format = "\
        <h2>" + name + "</h2>\
        種類：" + type + "<br>\
        " + free + available + dist + "<hr>\
        " + clean + "<br>\
        " + paper + "<br>\
        " + soap;
    return format;
}

function findToilet() {
    if (!navigator.geolocation) {
        alert('瀏覽器不支援定位功能');
        return [1, null, null];
    }
    return navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
}
function locationSuccess(position) {
    var longitude = position.coords.longitude, latitude = position.coords.latitude;
    markerLayer.getLayers().forEach((item) => {
        markerLayer.removeLayer(item);
    });
    var marker = L.marker([latitude, longitude]).addTo(markerLayer);
    marker._icon.classList.add("icon_red");
    map.flyTo([latitude, longitude], 15);
    marker.bindPopup("現在位置").openPopup();
    calcDistance();
}
function calcDistance() {
    var distance = getDistance();
    displayToilet(toiletsAll, distance);
}
function locationError(err) {
    switch (err.code) {
        case err.PERMISSION_DENIED:
            alert("請開啟瀏覽器的定位功能");
            break;
        case err.POSITION_UNAVAILABLE:
            alert("無法取得定位資料");
            break;
        case err.TIMEOUT:
            alert("無法取得定位資料");
            break;
        case err.UNKNOWN_ERROR:
            alert("未知錯誤，請回報開發者");
            break;
    }
    return [2, null, null];
}

function addToilet() {
    document.getElementById("overlay").style.visibility = "visible";
    document.getElementById("menu").style.visibility = "visible";
}
function form() {
    formLayer.getLayers().forEach((item) => {
        formLayer.removeLayer(item);
    });
    var marker = L.marker(map.getCenter()).addTo(formLayer);
    marker.bindPopup(makeForm()).openPopup();
    closeDialog();
}
function makeForm() {
    var format = "\
        <div class='form'>\
            <label for='name'>廁所名稱：</label>\
            <input type='text' id='form_name' name='name'><br>\
            <label for='type'>廁所種類：</label>\
            <select id='form_type' name='type'>\
                <option value='All Gender'>不分性別</option>\
                <option value='Male'>男廁</option>\
                <option value='Female'>女廁</option>\
                <option value='Disabled'>無障礙</option>\
            </select><br>\
            <input type='checkbox' id='form_isFree' name='isFree' value='isFree' checked>\
            <label for='isFree'>免費使用</label>\
            <input type='checkbox' id='form_isAvailable' name='isAvailable' value='isAvailable' checked>\
            <label for='isAvailable'>目前可用</label>\
            <input type='checkbox' id='form_isClean' name='isClean' value='isClean' checked>\
            <label for='isClean'>乾淨整潔</label><br>\
            <input type='checkbox' id='form_isPaper' name='isPaper' value='isPaper'>\
            <label for='isPaper'>有衛生紙</label>\
            <input type='checkbox' id='form_isSoap' name='isSoap' value='isSoap'>\
            <label for='isSoap'>有肥皂</label><br>\
            <input type='text' id='form_latitude' name='name' value="+ map.getCenter().lat + " hidden>\
            <input type='text' id='form_longitude' name='name' value="+ map.getCenter().lng + " hidden>\
            <input type='button' value='送出' onclick='submit()'>\
        </div>";
    return format;
}
function submit() {
    if(v("form_name") == ""){
        alert("請輸入廁所名稱");
        return;
    }
    /*
    let url = ""; // fill url here
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            name: v(form_name),
            type: v(form_type),
            isFree: c(form_isFree),
            Longitude: v(form_longitude),
            Latitude: v(form_latitude),
            Status: {
                isAvailable: c(form_isAvailable),
                isClean: c(form_isClean),
                isPaper: c(form_isPaper),
                isSoap: c(form_isSoap)
            }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then((response) => {
        if (response.ok) {
            refresh();
        }
        throw new Error('無法連絡伺服器，請回報開發者');
    }).catch((error) => {
        alert(error);
    });*/
    test3.push(new Toilet().set({ //test
        name: v("form_name"),
        type: v("form_type"),
        isFree: c("form_isFree"),
        Longitude: v("form_longitude"),
        Latitude: v("form_latitude"),
        Status: {
            isAvailable: c("form_isAvailable"),
            isClean: c("form_isClean"),
            isPaper: c("form_isPaper"),
            isSoap: c("form_isSoap")
        }
    }));
    refresh(); //test
}
function v(id){
    return document.getElementById(id).value;
}
function c(id){
    return document.getElementById(id).checked;
}
function closeDialog() {
    document.getElementById("overlay").style.visibility = "hidden";
    document.getElementById("menu").style.visibility = "hidden";
}
function refresh(){
    alert('資料上傳成功');
    formLayer.getLayers().forEach((item) => {
        formLayer.removeLayer(item);
    });
    getToiletLocation();
    displayToilet(test3, null); //test
}