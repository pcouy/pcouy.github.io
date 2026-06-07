function getTags(item) {
    if (item.dataset.hasOwnProperty("tags")) {
        return item.dataset["tags"].split(",");
    } else {
        return [];
    }
}

function getUniqueTags(list) {
    let items = Array.from(list.getElementsByTagName("li"));
    console.log(items);
    let tags = items.map(getTags)
        .reduce((a,b)=>a.concat(b))
        .sort()
        .reduce((arr, it) => arr.indexOf(it)===-1 ? arr.concat([it]) : arr, []);
    return tags;
}


function showOnly(list, tags) {
    let items = Array.from(list.getElementsByTagName("li"));
    items.forEach(item => {
        if (tags.length == 0) { // If no tag filtered, show all
            item.style.display = "list-item";
            return;
        }
        let itemTags = getTags(item);
        let found = tags.reduce((result, tag) => itemTags.indexOf(tag)===-1 ? result : true, false);
        item.style.display = found ? "list-item" : "none";
    });
}

function selectedTags(form) {
    return Array.from(form.querySelectorAll("input.tag-filter:checked")).map(c=>c.value);
}

function populateTagsFilters() {
    Array.from(document.getElementsByClassName("tags-filter")).forEach(form => {
        let searchTags = document.createElement("input");
        searchTags.type = "text";
        searchTags.placeholder = "Search tags...";
        searchTags.classList.add("search-tags");
        let tagRow = document.createElement("fieldset");
        tagRow.classList.add("tag-row");
        let targetQuery = form.dataset.target;
        let list = document.querySelector(targetQuery);
        let uniqueTags = getUniqueTags(list);
        let labels = uniqueTags.map(tag => {
            let label = document.createElement("label");
            label.classList.add("my-checkbox");
            let checkbox = document.createElement("input");
            checkbox.value = tag;
            checkbox.type = "checkbox";
            checkbox.classList.add("tag-filter");
            label.innerText = tag;
            label.prepend(checkbox);
            tagRow.appendChild(label);
            checkbox.addEventListener("change", ()=>{
                showOnly(list, selectedTags(form))
            });
            return label;
        });
        form.appendChild(searchTags);
        form.appendChild(tagRow);
        searchTags.addEventListener("input", ()=>{
            labels.forEach(label => {
                let value = label.querySelector("input").value;
                if (value.indexOf(searchTags.value) == 0 || searchTags.value.length === 0) {
                    label.style.display = "inline";
                } else {
                    label.style.display = "none";
                }
            });
        })
    });
}

function linksMain() {
    let list = document.getElementById("shared-links");
    let tags = getUniqueTags(list);
    populateTagsFilters();
}

linksMain();
