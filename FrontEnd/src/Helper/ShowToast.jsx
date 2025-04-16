import { toast } from "react-toastify"

export const showToast = (type,message,pos=1,time=3000)=>{
    const config = {
            position: pos==1?"top-right":"top-left",
            autoClose: time==3000?time:time,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
    }
    if(type=== 'success'){
        toast.success(message,config);
    } else if(type==='error'){
        toast.error(message,config);
    } else if(type==='info'){
        toast.info(message,config);
    } else{
        toast(message,config);
    }
}