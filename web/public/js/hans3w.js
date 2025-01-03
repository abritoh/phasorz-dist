/* ***
PhasorZ + Hans3w | By ClusterBR (arcbrth@gmail.com) (c) 2025 | Compiled and deployed implementing MS-GitHub Wfs
*** */

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('inputArea').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            evaluateExpression();
        }
    });
});

async function evaluateExpression() {
    const inputExpression = document.getElementById("expressionInput").value;

    if (!inputExpression) {
        alert("Please enter a valid expression.");
        return;
    }

    //-- fetch-phasorz-web-api

    const encodedExpression = encodeURIComponent(inputExpression);

    fetch(`phasorz/evaluate?exp=${encodedExpression}`)
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            document.getElementById("evaluationResult").innerHTML = `
            <p><strong>Input Expression:</strong> ${data.input_exp}</p>
            <p><strong>Evaluated Result:</strong> ${data.eval_exp}</p>
            <p><strong>Postfix Expression:</strong>${data.postfix_exp}</p>`;
            renderTree(data.ast_postfix);
        } else {
            clearTree();
            document.getElementById("evaluationResult").innerHTML = `
            <section class="section-error">
            <p class='eval-error'>Error evaluating the expression.</p> 
            <p class='server-msg'>${data.msg}</p>
            <p class='eval-info'>Enter a valid math-expression.</p>
            <p class='eval-link'><a href='public/help.html' target='_blank'>
                See valid expressions and available math-functions.</a></p>
            </section>`;
        }
    })
    .catch(error => console.error("Server-response-with-error", error.message));
}

const convertToD3Format = (node) => {
    if (node.type === "LeafNode") {
        return { name: node.value, type: 'leaf-node' };
    } else {
        return {
            name: node._operator,
            type: 'operator-node',
            children: node.children.map(convertToD3Format)
        };
    }
};

function clearTree() {
    const container = "#d3tree";
    d3.select(container).selectAll("*").remove();
}

function clearInput() {
    document.getElementById("expressionInput").value = "";
}

function calculateASTDimensions(astJson) {
    function calculateDepth(node) {
        if (!node.children || node.children.length === 0) return 1;
        let maxChildDepth = 0;
        node.children.forEach(child => {
            maxChildDepth = Math.max(maxChildDepth, calculateDepth(child));
        });
        return 1 + maxChildDepth;
    }
    function calculateNodeCount(node) {
        if (!node.children || node.children.length === 0)return 1;
        let count = 1;
        node.children.forEach(child => { count += calculateNodeCount(child);});
        return count;
    }
    const depth = calculateDepth(astJson);
    const nodeCount = calculateNodeCount(astJson);
    let dimensions = { width: 600, height: 500, container_w:"65%", container_h:"500px" };
    if (depth >= 3 || nodeCount >= 8) dimensions = { width: 700, height: 700, container_w:"75%", container_h:"720px" };
    if (depth > 4 || nodeCount >= 15) dimensions = { width: 800, height: 900, container_w:"90%", container_h:"920px" };
    return dimensions;
}

function renderTree(astJson) {

    const container = "#d3tree";
    const containerObject = document.getElementById("d3tree");
    const d3Data = convertToD3Format(astJson);    
    d3.select(container).selectAll("*").remove();

    var dimensions = calculateASTDimensions(astJson);

    containerObject.style.width = dimensions.container_w;
    containerObject.style.height = dimensions.container_h;

    const svg = d3.select(container).append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 " + dimensions.width + " " + dimensions.height )
        .attr("preserveAspectRatio", "xMidYMin meet");

    const margin = { top: 60, right: 60, bottom: 20, left: 60 };
    const width = dimensions.width - margin.right - margin.left;
    const height = dimensions.height - margin.top - margin.bottom;

    const tree = d3.tree().size([height, width]);
    const root = d3.hierarchy(d3Data, d => d.children);
    const links = tree(root).links();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const titleText = svg.append("text")
        .attr("x", dimensions.width/2 )
        .attr("y", margin.top - 30)
        .attr("text-anchor", "middle")
        .attr("class", "tree-title")
        .text("Postfix Abstract Syntax Tree");

    g.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkVertical().x(d => d.x).y(d => d.y));

    const nodes = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", d => `node ${d.data.type}`)
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", 16);

    nodes.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name);
    
    titleText.on("end", function() {
        const textWidth = titleText.node().getBBox().width;
        titleText.attr("x", (svg.attr("width") - textWidth) / 2);
    });
}

function exportToPDF() { 
    const element = document.getElementById('document');
    const options = {
      margin: 0.5,
      filename: 'hans3w-wb.pdf',
      html2canvas: { scale: 2 },      
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(options).save();    
}

function toggleMenu() {
    const menu = document.getElementById("menu");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
        document.addEventListener('click', closeMenuOnClickOutside, true);
        addLinkClickListeners();
    }
}

function closeMenuOnClickOutside(event) {
    const menu = document.getElementById("menu");
    const menuIcon = document.querySelector(".menu-icon");

    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.style.display = "none";
        document.removeEventListener('click', closeMenuOnClickOutside, true);
    }
}

function addLinkClickListeners() {
    const menuLinks = document.querySelectorAll("#menu a");
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.getElementById("menu");
            menu.style.display = "none";
            document.removeEventListener('click', closeMenuOnClickOutside, true);
        });
    });
}
