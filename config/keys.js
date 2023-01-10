if(process.env.NODE_ENV==='production'){
    module.exports=require('./prod')
}else{
    module.exports=requrie('./dev')
}