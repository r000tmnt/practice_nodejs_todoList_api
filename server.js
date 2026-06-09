import { v4 as uuidv4 } from "uuid";
import * as http from 'http'
import { returnSuccess, returnError } from './responseHandler.js'

const todoList = [

]

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
                returnSuccess(response, header, todoList) 
            }else{
                returnError(response, header)
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

                            returnSuccess(response, header, todoList)                               
                        }else{
                            returnError(response, header, 400, "Data structure unmatched.")
                        }
                    } catch (error) {
                        returnError(response, header, 400, error)                         
                    }
                })
            }else{
                returnError(response, header)
            }
            return
        case 'DELETE':
            if(request.url.includes('/todos')){
                request.on('end', () => {
                    try {
                        const data = JSON.parse(body)

                        if(data.id !== undefined){
                            const index = todoList.findIndex(todo => todo.id === data.id)

                            if(index >= 0){
                                console.log(index)
                                todoList.splice(index, 1)

                                returnSuccess(response, header, todoList)                                     
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
            }else{
                returnError(response, header)
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

                                returnSuccess(response, header, todoList)                                  
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
            }else{
                returnError(response, header)
            }            
            return
    }
}).listen(process.env.PORT || 8080)