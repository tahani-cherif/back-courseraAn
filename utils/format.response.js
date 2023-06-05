module.exports = (status,message, payload=null)=>{
    return (
        {
            status,
            message,
            payload
        }
    )
}