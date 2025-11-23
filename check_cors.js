const url = "https://img.a.transfermarkt.technology/portrait/header/358948-1728392103.JPG";

fetch(url, { method: 'HEAD' })
    .then(res => {
        console.log("Status:", res.status);
        console.log("CORS Headers:");
        console.log("Access-Control-Allow-Origin:", res.headers.get('access-control-allow-origin'));
        console.log("Access-Control-Allow-Methods:", res.headers.get('access-control-allow-methods'));
    })
    .catch(err => console.error("Error:", err));
