import express from "express"
import createHttpError from "http-errors";
import listModel from "./schema.js"

const listRouter = express.Router()

listRouter.get("/", async (req, res, next) => {
    try {
      const lists = await listModel.find({}).populate({
          path:"user",
          select: "username"
      })  
      res.send(lists)
    } catch (error) {
        next(error)
    }
})

listRouter.post("/", async (req, res, next) => {
    try {
        const newList = new listModel(req.body)
        const list = await newList.save()
        res.send(list)
    } catch (error) {
        next(error) 
        res.status(500).send({ message: error.message });
    }
})
listRouter.get("/:Id", async (req, res, next) => {
    try {
        const list = await listModel.find({}).populate({
            path:"user",
            select: "username"
        })  
        console.log("whole list", list)
        const userId = req.params.Id
        const thatList = await list.find(l=> l.user._id.toString()===userId )
        console.log("that list",thatList )
        res.send(thatList)
    } catch (error) {
        next(error) 
    }
})

listRouter.put("/:id", async (req, res, next) => {
    try {
        const list = await listModel.findById(req.params.id)
        const updatedList = await listModel.findByIdAndUpdate(list, req.body, {new:true})
        if (updatedList){
            res.send(updatedList)
        } else {
            createHttpError(404, "list not found")
        }
    } catch (error) {
        next(error) 
    }
})
listRouter.post("/:id/task", async (req, res, next) =>{
    try {
        const list = await listModel.findById(req.params.id)
        if(!list){
            res.status(404)
        } else {
            const task = await listModel.findByIdAndUpdate(
                list, 
                {$push: {tasks: req.body}},
                {new:true}
            )
            res.status(200).send({task})
        }
    } catch (error) {
        next(error) 
    }
})

listRouter.put("/:id/task/:taskId", async (req, res, next) =>{
    try {
       const list = await listModel.findById(req.params.id)
       if(list){
           const index = list.tasks.findIndex(t=> t._id.toString() === req.params.taskId)
           if(index !== -1) {
               list.tasks[index] = {...list.tasks[index].toObject(), ...req.body}
               await list.save()
               res.send(list)
           } else {
               res.send(`task not found`)
           }
       } else {
           res.send(`list not found`)
       }
    } catch (error) {
        next(error) 
    }
})

listRouter.delete("/:id/task/:taskId", async (req, res, next) =>{
    try {
       const list = await listModel.findByIdAndUpdate(req.params.id,
       {$pull: {tasks: {_id:req.params.taskId}}}, {new:true})
       if(list){
          res.send(list)
       } else {
           res.send(`list not found`)
       }
    } catch (error) {
        next(error) 
    }
})

listRouter.delete("/:id", async (req, res, next) => {
    try {
        const listId = req.params.id
        const deletedList = await listModel.findByIdAndDelete(listId)
        if(deletedList){
            res.status(204)
        } else {
            next(createHttpError(404, "list not found"))
        }
    } catch (error) {
        next(error) 
    }
})
export default listRouter