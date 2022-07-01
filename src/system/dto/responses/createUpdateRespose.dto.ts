export class createUpdateResponseDTO {
  name: string;
  description?: string;
  version: string;
  dateStart?: string;
  dateEnd?: string;
  id: string;
  
  constructor(props) {
    if(props?.id){
      this.id = props.id;
    }
    if(props?.name){
      this.name = props.name;
    }
    if(props?.description){
      this.description = props.description;
    }
    if(props?.version){
      this.version = props.version;
    }
    if(props?.dateStart){
      this.dateStart = props.dateStart;
    }
    if(props?.dateEnd){
      this.dateEnd = props.dateEnd;
    }
  }
}
