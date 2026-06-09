export const returnSuccess = (response, header, data) => {
    response.writeHead(200, header)
    response.write(JSON.stringify({ "success": true, "data": data }))
    response.end()    
}

export const returnError = (response, header, status=404, message='Not found') => {
    response.writeHead(status, header)
    response.write(JSON.stringify({ "success": false, "message": message }))
    response.end()    
}