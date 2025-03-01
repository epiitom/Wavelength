const z = require('zod');
  // this is schema the user should put this type of dta
const verifySchema = z.object({
     name : z.string().min(2),
     email:z.string( ).email(),
     password: z.string().min(8)
})
//checking if user put the validate  data  according to schem
module.exports ={
    verifySchema
}