import React,{useState,useEffect} from 'react';
import axios from 'axios';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBBtnGroup
} from 'mdb-react-ui-kit'
import './App.css';

function App() {
  const [data,setData]=useState([]);
  const [value,setvalue]=useState("");
  const [useSort,setuseSort]=useState("");
  const sortOptions=["Name","Id","Title","Status"]

  useEffect(()=>{
    loadUsersData();
  },[]);
  const loadUsersData=async()=>{
      return await axios.get("http://localhost:5000/users")
      .then((response)=>setData(response.data))
      .catch((err)=>console.log(err));
  }
  // console.log("data",data)
  
  const handleReset=()=>{
    loadUsersData();
  };
  const handleSearch=async (e)=>{
    // console.log("Seacrh Name "+e);
        e.preventDefault();
        return  await axios.get(`http://localhost:5000/users?q=${value}`)
        .then((response)=>{
          setData(response.data);
          setvalue('');
        })
        .catch((err)=>console.log(err))
  }
  const handleSort= async (e)=>{
    // console.log("select Value "+e.target.value)
    let value=e.target.value;
    setuseSort(value);
    return await axios.get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
    .then((response)=>{
      setData(response.data);
       
    })
    .catch((err)=>console.log(err))
}
const handleFilter=async (e)=>{
  console.log("Active || Inactive Status "+e)
  return await axios.get(`http://localhost:5000/users?Status=${e}`)
  .then((response)=>{
    setData(response.data);
     
  })
  .catch((err)=>console.log(err))

}
  return (
    <MDBContainer>
    <form style={{
      margin:"auto",
      padding:"15px",
      maxWidth:"400px",
      alignContent:"center"
    }}
    className='d-flex input-group w-auto'
    onSubmit={handleSearch}
    >
    <input 
    type="text" 
    className='form-control'
    placeholder='Search Name ..'
    value={value}
    
    onChange={(e)=>{
      e.preventDefault();
      setvalue(e.target.value)
      
    }}
     />
    
         <MDBBtn type='submit' color='dark' >Search</MDBBtn>
         <MDBBtn className='mx-2' color='info' onClick={()=>handleReset()}>Reset</MDBBtn>
         
      
    </form>
    <MDBRow className='mt-5 mb-5'>
          <MDBCol>

            <h5>Sort By</h5>
            <select style={{width:"100%",borderRadius:"2px",height:"35px"}}
            onChange={handleSort}
            
            >
              <option >Please Select Options</option>
              {sortOptions.map((item,index)=>(
                <option key={index}>{item}</option>
              ))}
            </select>
          </MDBCol>
          <MDBCol style={{marginLeft:"800px"}}>
            <h5>Filter By Status:</h5>
            <MDBBtnGroup>
              <MDBBtn color='success' onClick={()=>handleFilter("Active")}>Active</MDBBtn>
              <MDBBtn color='danger' style={{marginLeft:'2px'}} onClick={()=>handleFilter("Inactive")}>Inactive</MDBBtn>
            </MDBBtnGroup>
          </MDBCol>
        </MDBRow>
 
        <div style={{marginTop:"100px"}}>
        <h2 className='text-center'>Search,Filter,Sort and Pagination Using Fake  API</h2>
            <MDBRow>
              <MDBCol size='12'>
                  <MDBTable>
                      <MDBTableHead dark>
                          <tr>
                            <th scope="col">S.No</th>
                            <th scope="col">Name</th>
                            <th scope="col">Id</th>
                            <th scope="col">Title</th>
                            <th scope="col">Status</th>
                          </tr>
                      </MDBTableHead>
                      {data.length===0?(
                        <MDBTableBody className='align-center mb-0'>
                            <tr>
                              <td colspan={6} className='text-center mb-0  '>No Data Form</td>
                            </tr>
                        </MDBTableBody>
                      ):(
                        data.map((item,index)=>(
                          <MDBTableBody key={index}>
                               <tr>
                      
                                <th scope="row">{index+1}</th>
                                <td>{item.Name}</td>
                                <td>{item.Id}</td>
                                <td>{item.Title}</td>
                                <td>{item.Status}</td>
                               </tr>
                          </MDBTableBody>
                        ))
                      )}

                  </MDBTable>
              </MDBCol>
            </MDBRow>
        </div>
       
    </MDBContainer>
  );
}

export default App;
