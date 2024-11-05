import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'https://openlibrary.org'
  });


export async function searchBook(data){

    try {
        const response = await instance({
            url : "/search.json",
            method : "GET",
                       

            // `params` are the URL parameters to be sent with the request
            // Must be a plain object or a URLSearchParams object
            params: {title : data,
                    page : 1,
                    limit : 10,
                    },
            
            
        })   
        
        
        const full_book_list = response.data.docs;
        
        const simplified_book_list = full_book_list.map( book => ({
            author_name : book.author_name,
            key : book.key,
            title : book.title,
            coverId : book.cover_i,
            
        } ))

        return  simplified_book_list // return the JSON formated data

    }

    catch (error) {
        console.error(error);
        return "error"
      }

    
     
}

