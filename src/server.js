const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
import path from 'path';
const GRPC_PROTO_PATH = path.resolve(path.join(__dirname, "proto"));
const PRODUCT_PROTO_PATH = GRPC_PROTO_PATH + "/index.proto";

const packageDef = protoLoader.loadSync(PRODUCT_PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [GRPC_PROTO_PATH]
});
const gRPCObject = grpc.loadPackageDefinition(packageDef);
const productPackage = gRPCObject.product;

const products = [];
function createProduct(call, callback) {
    try {
        const body = call.request;
        products.push(body);
        return callback(null, body)
    } catch (error) {
        console.log("Error ocurred while create the product", JSON.stringify(error, null, 2))
    } finally { }
};

function readProduct(call, callback) {
    try {
        const { id } = call.request;
        const product = products.find(p => p.id === id);
        return callback(null, product)
    } catch (error) {

    } finally { }
}
function readProducts(call, callback) {
    return callback(null, { products })
}
function updateProduct(call, callback) { }
function deleteProduct(call, callback) {
    try {

    } catch (error) {

    } finally {

    }
}

async function main() {
    console.log("Starting Server!");
    const server = new grpc.Server();
    server.addService(productPackage.Product.service, {
        createProduct,
        readProduct,
        readProducts,
        updateProduct,
        deleteProduct,
    });

    server.bindAsync("0.0.0.0:4000", grpc.ServerCredentials.createInsecure(), async (error, port) => {
        if (error) {
            console.log(error)
        }
        console.log(`listening on port ${port}`)
    });
}
main();