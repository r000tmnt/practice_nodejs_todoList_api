import { v4 as uuidv4 } from "uuid";
import * as http from 'http'

const todoList = [

]

const returnError = (response, header, status=404, message='Not found') => {
    response.writeHead(status, header)
    response.write(JSON.stringify({ "success": false, "message": message }))
    response.end()    
}

http.createServer((request, response) => {
    const header = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }

    let body = ''

    request.on('data', (chunk) => {
        console.log(chunk)
        body += chunk
    })

    switch(request.method){
        case 'GET':
            if(request.url === '/todos'){
                response.writeHead(200, header)
                response.write(JSON.stringify({ "success": true, "data": todoList }))
                response.end()   
            }
            return
        case 'POST':
            if(request.url === '/todos'){
                request.on('end', () => {
                    try {
                        const data = JSON.parse(body)

                        if(data.title !== undefined){
                            todoList.push({
                                id: uuidv4(),
                                title: data.title
                            })

                            response.writeHead(200, header)
                            response.write(JSON.stringify({ "success": true, "data": todoList }))
                            response.end()                                
                        }else{
                            returnError(response, header, 400, "Data structure unmatched.")
                        }
                    } catch (error) {
                        returnError(response, header, 400, error)                         
                    }
                })
            }
            return
        case 'DELETE':
            if(request.url.includes('/todos')){
                const id = request.url.split('/').pop()

                if(id.includes('-')){
                    const index = todoList.findIndex(todo => todo.id === id)

                    if(index >= 0){
                        console.log(index)
                        todoList.splice(index, 1)
                        response.writeHead(200, header)
                        response.write(JSON.stringify({ "success": true, "data": todoList }))
                        response.end()                           
                    }else{
                        returnError(response, header, 400, "Id not found")
                    }
                }else{
                    todoList.splice(0)
                    response.writeHead(200, header)
                    response.write(JSON.stringify({ "success": true, "data": todoList }))
                    response.end()                       
                }
            }            
            return
        case 'PATCH':
            if(request.url === '/todos'){
                request.on('end', () => {
                    try {
                        const data = JSON.parse(body)

                        if(data.title !== undefined && data.id !== undefined){
                            const index = todoList.findIndex(todo => todo.id === data.id)

                            if(index >= 0){
                                todoList[index].title = data.title

                                response.writeHead(200, header)
                                response.write(JSON.stringify({ "success": true, "data": todoList }))
                                response.end()                                       
                            }else{
                                returnError(response, header, 400, "Id not found")
                            }                         
                        }else{
                            returnError(response, header, 400, "Data structure unmatched.")
                        }
                    } catch (error) {
                        returnError(response, header, 400, error)                         
                    }
                })
            }            
            return
        default:
            returnError(response, header, 404)
            return
    }
}).listen(process.env.port || 8080)