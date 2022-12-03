/*
Handcoded By Chee Yong Lee (https://github.com/joeleeofficial) & (https://github.com/leecheeyong)
This code is available as open source under the terms of the MIT License (https://github.com/CodingStudios/image-metadata/blob/main/LICENSE)
*/

const table = document.getElementById("data");
const url = document.getElementById("url");

function wrap(obj) {
  var content = "";
  for(i in obj) {
     content += `<b>${i}:</b> ${typeof obj[i] == "object" ? `&#09; ${wrap(obj[i])}` : obj[i]}<br>`
  }
  return content;
}

document.getElementById("file").onchange = () => {
  const file = document.getElementById("file");
  const { size, name, type } = file.files[0];
  url.disabled = true;
  url.value = `${name} (${type})`;
}

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const file = document.getElementById("file").files[0];
  function getData(path, body) {
  fetch(`/${path}`, {
    method: "POST",
    ...body
  }).then(r=>r.json()).then(data => {
    table.replaceChildren();
    for(i in data) {
      const box = document.createElement("tr");
      const name = document.createElement("td");
      name.textContent = i;
      const value = document.createElement("td");
      value.innerHTML = typeof data[i] == "object" ? wrap(data[i]) : data[i];
      box.appendChild(name);
      box.appendChild(value);
      table.appendChild(box);
    }
  })
  }
  
  if(url.value && !url.disabled) {
  getData("url", { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url.value }) });
  }else if(file) {
  const form = new FormData();
  form.append("file", file);
  getData("image", { body: form });
    url.textContent = "";
    url.disabled = false;
  }
})
