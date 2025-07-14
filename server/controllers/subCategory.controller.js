import { error } from "console"
import { ProductModel } from "../model/product.model.js"
import { subcategoryModel } from "../model/subcategory.model.js"

export const addSubCategory = async (req ,res) => {
    try {
        const {name ,image ,category} = req.body
        const payload ={
            image,
            name,
            category
        }

        const addsubcategory = new subcategoryModel(payload)
        const saveSubCategory = await addsubcategory.save()

        if (!saveSubCategory) {
            return res.status(500).json({
                message: "sub category Not created",
                error: true,
                success: false,
              });
            
        }
        return res.status(200).json({
            message: "Add sub Category",
            error: false,
            success: true,
            data: saveSubCategory,
          });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
          });
    }
    
}

export const allSubCategory = async (req ,res) => {
    try {
        const data = await subcategoryModel.find().sort({ createdAt: -1 }).populate('category');
        return res.status(200).json({
          data: data,
          error: false,
          success: true,
        });
      } catch (error) {
        return res.status(500).json({
          message: error.message || error,
          error: true,
          success: false,
        });
      }
}

export const updateSubCategory = async (req,res) => {
  try {
    const {_id ,name ,image ,category} =req.body

    const checkSubcategory = await subcategoryModel.findByIdAndUpdate(_id ,{name ,image ,category} ,{new:true})
    if(!checkSubcategory){
      return res.status(400).json({
        message:"subCategory not present",
        success:false,
        error:true
      }) 
    }
    return res.status(200).json({
      message:"subCategory updated",
      success:true,
      error:false ,
      body:checkSubcategory
    }) 

    
  } catch (error) {
    return res.status(500).json({
      message:error.message ||error,
      success:false,
      error:true
    })
  }
  
}

export const deleteSubCategory = async(req,res)=>{
  try {
    const {subCategoryId} = req.body
    const checkProduct =  await ProductModel.find({
          category: {
            $in: [{ _id: subCategoryId }],
          },
        }).countDocuments();

        if (checkProduct > 0 ) {
          return res.status(400).json({
            message: "Sub Category is already use can't deleted",
            error: true,
            success: false,
          });
        }    

        const deleteCategory = await subcategoryModel.findByIdAndDelete({
              _id:subCategoryId ,
            });
            return res.status(200).json({
              message: "Delete Sub Category",
              error: false,
              success: true,
            });
    
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
  
}

export const getSuncategoryListUsingCategoryId = async (req ,res) => {
  try {

    const {id ,name } = req.body
    if (!id) {
      return res.status(400).json({
        message: "Category ID is required",
        success: false,
        error: true,
        data: null
      });
    }

    
    const subCategoryList = await subcategoryModel.find({"category" :{$in :id}}).populate("category")
    if(subCategoryList.length ==0){
      return res.status(404).json({
        message:"In This category related subCategory not found ",
        success:true,
        error:true,
        data:[]
      })
    }
    return res.status(200).json({
      message:"Successfully Subcategory fetch",
      success:true,
      error:false,
      data:subCategoryList
    })
    
  } catch (error) {
    console.log("Subcategory Error Using categoryId " ,error.message ||error)

    return res.status(500).json({
      message :error.message ||error,
      success:false,
      error:true
    })
  }
}