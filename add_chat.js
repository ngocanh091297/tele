// Setting & Connect to the Database
let configDB = require('./config/database');
let mongoose = require('mongoose');

let helpers   = require('./app/Helpers/Helpers');
// mongoose.set('debug', true);
require('mongoose-long')(mongoose); // INT 64bit

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

console.log(configDB);

const fs = require('fs')
let TaiXiu_bot_chat     = require('./app/Models/TaiXiu_bot_chat');
let RongHo_bot_chat     = require('./app/Models/RongHo/RongHo_bot_chat');


mongoose.connect(configDB.url, configDB.options)
    .then(function () {
        // console.log('Connect to MongoDB success');

        TaiXiu_bot_chat.find({})
        .then((results) => {
          console.log("kq", results); // Kết quả là một mảng chứa các tài liệu trong collection
          let a =results[0].Content
          let arr = a.split("\n")
          console.log(arr[0])
        })
        .catch((err) => {
          console.error(err); // Xử lý lỗi nếu có
        });
       
		
		

        // fs.readFile('textchat.txt', 'utf8' , (err, data) => {
        //     if (err) {
        //       console.error(err)
        //       return
        //     }
        //     let arrData = data.split('\r\n')
        //     console.log("arrData",arrData)
        //     // addItemDB(arrData[0])
        //     for(let i =0 ;i <arrData.length;i++)
        //     {
                
        //         addItemDB(arrData[i])
        //     }
            
        //   })

        // TaiXiu_bot_chat.create({'Content':"Uid"}, function(errC, AAA){
        //     if (!!errC) {

        //     }else{
        //         console.log("AAA",AAA)
        //     }
                
        // });


        
        console.log('End');
    })
    .catch(function(error) {
        console.log(error);
        if (error)
            console.log('Connect to MongoDB failed', error);
        else{

        }
});


function addItemDB (item){
    TaiXiu_bot_chat.create({'Content':item}, function(errC, AAA){
        if (!!errC) {

        }else{
            console.log("AAA",AAA)
        }
            
    });
}

