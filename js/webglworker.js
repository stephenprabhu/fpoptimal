self.onmessage = function(event) {
    const { vertices, indices, texCoords, normals, ID } = event.data;

    // Perform non-DOM computations
    const processedData = processData(vertices, indices, texCoords, normals);

    self.postMessage({ processedData, ID });
};

function processData(vertices, indices, texCoords, normals) {
    // Example of processing data
    // You can add more complex processing here if needed
    return { vertices, indices, texCoords, normals };
}
