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
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationLink,
  MDBPaginationItem
} from 'mdb-react-ui-kit'
import './App.css';

function App() {
  const [data,setData]=useState([]);
  const [value,setvalue]=useState("");
  const [useSort,setuseSort]=useState("");
  const[currentPage,setCurrentPage]=useState(0);
  const[pageLimit]=useState(5);
  const sortOptions=["Name","Id","Title","Status"]
  const[operation,setOperation]=useState("");
  const[sortFilterValue,setSortFilterValue]=useState("")
  useEffect(()=>{
    loadUsersData(0,5,0);
  },[]);
  const loadUsersData=async(start,end,increase,optType=null,filterOrSortValue)=>{
    switch(optType){
      case "search":
        setOperation(optType);
        setuseSort("");
        
        return  await axios.get(`http://localhost:5000/users?q=${value}&_start=${start}&_end=${end}`)
        .then((response)=>{
          setData(response.data);
          setCurrentPage(currentPage+increase)
    
        })
        .catch((err)=>console.log(err))
      default:
        return await axios.get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
      .then((response)=>{
        setData(response.data);
        setCurrentPage(currentPage+increase);
      })
      .catch((err)=>console.log(err));
    }  
    
  }
  // console.log("data",data)
  
  const handleReset=()=>{
    setOperation("");
    setvalue("");
    loadUsersData(0,5,0);
  };
  const handleSearch=async (e)=>{
    
    // console.log("Seacrh Name "+e);
    e.preventDefault();
    
        loadUsersData(0,5,0,'search');
        // return  await axios.get(`http://localhost:5000/users?q=${value}`)
        // .then((response)=>{
        //   setData(response.data);
        //   setvalue('');
        // })
        // .catch((err)=>console.log(err))
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
 const renderPagination=()=>{
  if(data.length<4 && currentPage===0) return null
  if(currentPage===0){
    return (
      <MDBPagination className='mb-0'>
        <MDBPaginationItem>
          <MDBPaginationLink>1</MDBPaginationLink>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBBtn onClick={()=>loadUsersData(5,10,1,operation)}>Next</MDBBtn>
        </MDBPaginationItem>
      </MDBPagination>
    )
  }
  else if(currentPage<pageLimit-1 && data.length===pageLimit){
    return (
      <MDBPagination className='mb-0'>
      <MDBPaginationItem>
        <MDBBtn onClick={()=>loadUsersData((currentPage-1)*5,(currentPage*5),-1,operation)}>Previous</MDBBtn>
      </MDBPaginationItem>
      <MDBPaginationItem>
        <MDBPaginationLink>{currentPage+1}</MDBPaginationLink>
      </MDBPaginationItem>
      <MDBPaginationItem>
        <MDBBtn onClick={()=>loadUsersData((currentPage+1)*5,(currentPage+2)*5,1,operation)}>Next</MDBBtn>
      </MDBPaginationItem>
    </MDBPagination>
    )
  }
  else{
    return (
      <MDBPagination className='mb-0'>
      <MDBPaginationItem>
        <MDBBtn onClick=
        {()=>
        loadUsersData((currentPage-1)*5,currentPage*5,-1,operation)}>Previous</MDBBtn>
      </MDBPaginationItem>
      <MDBPaginationItem>
        <MDBPaginationLink>{currentPage+1}</MDBPaginationLink>
      </MDBPaginationItem>
      

    </MDBPagination>
    )
  }
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
            <div style={{
      margin:"auto",
      padding:"15px",
      maxWidth:"250px",
      alignContent:"center"
    }}>

              {renderPagination()}
            </div>
        </div>
       
    </MDBContainer>
  );
}

export default App;
