let dragged;
let clipboard;
[].forEach.call(document.getElementsByClassName('tags-input'), function (el) {
    let hiddenInput = document.createElement('input'),
        mainInput = document.createElement('input'),
        tags = [];         
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', el.getAttribute('data-name'));

    mainInput.setAttribute('type', 'text');
    mainInput.classList.add('main-input');
    mainInput.ondragover = "event.dataTransfer.setData('text/plain',null)";
    mainInput.addEventListener('input', function () {
        let enteredTags = mainInput.value.split(',');
        if (enteredTags.length > 1) {
            enteredTags.forEach(function (t) {
                let filteredTag = filterTag(t);
                if (filteredTag.length > 0)
                    addTag(t);
            });
            mainInput.value = '';
        }
    });

    mainInput.addEventListener('keydown', function (e) {
        let keyCode = e.which || e.keyCode;
        if (keyCode === 8 && mainInput.value.length === 0 && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    });

    mainInput.addEventListener("drop", function(event) {
        if (event.target.className == "main-input") {            
            dragged.parentNode.removeChild( dragged );            
            event.target.append(dragged);
            addTag(dragged.innerText);
        }
    }, false);
    mainInput.addEventListener("dragover", function(event) {
        event.preventDefault();
      }, false);

    mainInput.addEventListener('contextmenu', function (e) {
        addTag(clipboard);
        event.preventDefault();        
    });

    el.appendChild(mainInput);
    el.appendChild(hiddenInput);

    addTag('hello!');
    addTag('bye');
    
    function addTag (text) {
        let tag = {
            text: text,
            element: document.createElement('span'),
        };

        tag.element.classList.add('tag');
        tag.element.draggable = true;
        tag.element.ondragstart = "event.dataTransfer.setData('text/plain',null)";
        tag.element.textContent = tag.text;

        let closeBtn = document.createElement('span');
        closeBtn.classList.add('close');
        closeBtn.addEventListener('click', function () {            
            if(!tag.text.includes("!")){
                //Cambiar icono de aspa
                removeTag(tags.indexOf(tag));
            }
        });
        tag.element.addEventListener('contextmenu', function( event ) {
            clipboard = tag.element.textContent;
            event.preventDefault();
        });
        
        tag.element.addEventListener("dragstart", function(event) {
        dragged = event.target;
        event.target.style.opacity = .5;
        console.log(dragged);
        }, false);

        tag.element.addEventListener("dragend", function(event) {
        event.target.style.opacity = "";
        }, false);
        tag.element.addEventListener("dragover", function(event) {
        event.preventDefault();
        }, false); 

        tag.element.appendChild(closeBtn);

        tags.push(tag);

        el.insertBefore(tag.element, mainInput);

        refreshTags();
    }

    function removeTag (index) {
        let tag = tags[index];
        tags.splice(index, 1);
        el.removeChild(tag.element);
        refreshTags();
    }

    function refreshTags () {
        let tagsList = [];
        tags.forEach(function (t) {
            tagsList.push(t.text);
        });
        hiddenInput.value = tagsList.join(',');
        console.log(JSON.stringify(tagsList).length);
    }
    function filterTag (tag) {
        return tag.replace(/[^\w -]/g, '').trim().replace(/\W+/g, '-');
    }
});
