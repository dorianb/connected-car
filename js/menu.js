function setFilterComponent(id_list, objects) {
  var list = document.getElementById(id_list).getElementsByTagName("div")[0];

  for(object in objects) {
    var a = document.createElement("a");
    a.setAttribute("class", "list-group-item");
    a.setAttribute("onclick", "setActive(this)");

    var label = document.createElement("label");
    label.setAttribute("value", objects[object]);
    label.innerHTML = String(objects[object]);

    a.appendChild(label);
    list.appendChild(a);
  }
};

function resetFilterComponent(id_list, objects) {
  var list = document.getElementById(id_list).getElementsByTagName("div")[0];

  // Récupérer les noeuds actifs
  // Retirer tous les noeuds sauf ceux qui sont actifs
  /*var childs = list.childNodes;
  for(child in childs) {
    if(childs[child].classList && !childs[child].classList.contains("active")) {
      list.removeChild(childs[child]);
    }
  }*/
  // Ajouter les noeuds de la liste objects sauf ceux qui sont actifs
};

function setActive(elem) {
  event.stopPropagation();
  if(elem.classList.contains('active')) {
    elem.classList.remove('active');
  }
  else {
    elem.classList.add('active');
  }
  setFilter();
};

function getActive(id_list) {
  var list = Array.from(document.getElementById(id_list).getElementsByClassName("active"));

  return list.map(function(el) {
    return el.getElementsByTagName("label")[0].getAttribute("value");
  });
};
