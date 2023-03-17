function makeSection(node) {
    let newSection = document.createElement("section");
    let level = node.tagName;
    let nextNode = node.nextElementSibling;

    node.parentNode.insertBefore(newSection, node)
    newSection.append(node);
    
    while(nextNode && nextNode.tagName !== level){
        node = nextNode;
        nextNode = node.nextElementSibling;
        if (nextNode && nextNode.tagName[0] === "H" && nextNode.tagName !== level) {
            nextNode = makeSection(nextNode);
        }
        newSection.append(node);
    }

    return newSection;
}

function makeRootSections() {
    while((n=document.querySelector('article > :is(h1,h2,h3,h4,h5,h6)'))) {
        makeSection(n)
    }
}

makeRootSections()
