const  mongoose=require('mongoose');

const SessionEleveShema=new mongoose.Schema(
    {
        idEleve:{
            type:mongoose.Schema.Types.ObjectId,
            trim:true,
            ref:'User',
            require:[true,'id_eleve is require']
        },
        name:{
            type:String,
            trim:true,
            require:[true,'name require']
        },
        id_cour_terminer:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Courses"
        }],
        id_cour_commencer:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Courses',
        }],
        quizz_terminer:[
            {
                id_quizz:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Quiz'},
                note:{  //score quiz
                    type:Number
                }
            },
        ]
    },{timestamps:true}
);


const SessionEleve=mongoose.model('SessionEleve',SessionEleveShema);
module.exports=SessionEleve;