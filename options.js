function restore_options() {
  var tabTarget = localStorage["tabTarget"];
  if (!tabTarget) {
    return;
  }

  var select = document.getElementById("tabTarget");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == tabTarget) {
      child.selected = "true";
      break;
    }
  }
}

function save_options() {
  var select = document.getElementById("tabTarget");
  var tabTarget = select.children[select.selectedIndex].value;
  localStorage["tabTarget"] = tabTarget;

  var status_div = document.getElementById("status");
  status_div.innerHTML = "Saved.";
  setTimeout(function() {
    status_div.innerHTML = "";
  }, 750);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#tabTarget').addEventListener('change', save_options);
