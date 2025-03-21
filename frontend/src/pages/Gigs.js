import React, { useEffect, useState } from 'react'
import newRequest from "../utils/newRequest";

const Gigs = () => {

    const [categories, setCategories] = useState([]);
    const [gigs, setGigs] = useState([]);

    /*
    useEffect(() => {
        // fetchGigs();
      }, []);

    const fetchGigs = async () => {
        try {
          // const response = await axios.get(`${backend_url}/blog/get-all-blog`, {
          //   params: { page: currentPage, limit },
          // });
          const res = await newRequest.get("/gigs").then((res) => {
            return res.data;
          });
           console.log(res);
           // console.log(data);
          // dispatch(getBlog(response.data.data));
          // setTotalPages(response.data.totalPages); // Get total pages from the response
          // setLoading(false);
        } catch (error) {
          console.error("Error fetching blogs:", error);
        }
      };
    */

    useEffect(() => {
       
        getGigs()

    }, []);

    const getGigs = async () => {
        const res = await newRequest.get("/gigs")
             .then((res) => {
                 return res.data;
             })
             .then(data => setGigs(data))
             //.then(res => setGigs(res))
             ;
             // console.log(res);
             // console.log(gigs);
            // .then(res => res.json())
            // .then(data => setGigs(data))
            // .catch(err => console.error("Error fetching categories:", err)
        //  ); 
        // console.log(res);              
        // console.log(res.data);
        // console.log(gigs);
    }

    const renderGigs = (gigs) => {
        return (
          <ul>
            {gigs.map(gig => (
              <li key={gig._id}>
                {gig.title}
                
              </li>
            ))}
          </ul>
        );
    };

  return (
    <div>
        Gigs
        
        <div className="mt_wp" >
        <main role="main" className="container">

            <div className="starter-template">
              <h1>Bootstrap starter template - All Gigs</h1>
              <p className="lead">
                Use this document as a way to quickly start any new project.<br /> 
                All you get is this text and a mostly barebones HTML document.
              </p>
            </div>

            <div className="album py-5 bg-light">
              <div className="container">
                <h1>Gig List - Gig Card</h1>
              </div>
            </div>

            <div className="album py-5 bg-light">     
              <div className="container" >
              <div className="row">

                <h1>Gigs Experimental</h1>         
                <h3>Lets dp it!</h3> 

                <div>
                    {
                        // gigs.length > 0 ? renderGigs(gigs) : "Loading..."
                     }
                </div>

                <div>{renderGigs(gigs)}</div>

              </div> 
              </div>    
            </div>
            
        </main>        
      </div>

    </div>
  )
}

export default Gigs