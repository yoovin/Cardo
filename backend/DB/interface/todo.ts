import todoContent from "./todoContent"

export default interface todo {
    userid: string
    icon: string
    title: string
    todos: Array<todoContent>
    color: Array<string>
}