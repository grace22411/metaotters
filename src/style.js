import styled from "styled-components";
import background from "../src/assets/background.jpg"

export const HeroSection = styled.div`
  width: 100%;
  color: #fff;
  height:100vh;
  .header {
    width: 100%;
    //border: 1px solid white;
    height: 100px;
    padding: 30px 150px 0 150px;
    display: flex;
    justify-content: space-between;
    .nav{
      margin-top:15px ;
      li{
        list-style:none ;
        display:inline-block ;
        margin-left:50px ;
      }
    }

    .logo {
      width: 65px;
      height: 65px;
      p{
        font-size:13px ;
        margin-top:5px ;
        color:#000;
      }
      a{
        display:flex ;
        text-decoration:none ;
        
        h1{
          color:#fff;
          margin-left:15px;
          margin-top:10px; ;

        }
      }
      img {
        object-fit: cover;
        width: 65px;
        height:65px;
        border-radius:100% ;
      }
    }
  }

  .container {
    padding: 0 150px;
    text-align: center;
    margin-top: 100px;
    display:flex ;
    justify-content: center;
    .left,.right{
      width:23%;
      .picture{
        width:250px;
        margin-top:50px ;
        height:250px;
        img{
          width:100%;
          height:100%;
          object-fit:cover ;
        border-radius:100% ;
        }
      }
    }
    .middle{
      width:54%;
      margin-top:50px ;
      h1{
        color:#fff;
      }
      p{
        color:#fff;
        font-size:20px ;
      }
    }

   
    
  }

  @media only screen and (max-width: 600px) {
    min-height: 100vh;
    .header{
        padding:30px;
        height: 70px;;
        .logo{
            width:100%;
            height: 40px;;
            h1{
              font-size:25px;
              margin-top: 0px !important ;
            }
            img{
              height:40px;
              width:40px;
            }
        }
        .nav{
          display:none ;
        }
      
    }
    .container{
      padding:0  25px;;
      flex-direction:column ;
      margin-top:60px ;
     
        h1 {
          font-size: 25px;
          margin-top:20px
        }
        p{
          width:98%;
          font-size:13px;
        }
        
      
      .left,.right{
      width:100%;
      text-align:center;
      .picture{
        width:150px;
        height:150px ;
        margin:auto ;
      }
    }
    .middle{
      width:100%;
      margin-top:0 ;
    }
      
    }
  }
 
`;



