import { CanActivateFn } from '@angular/router';
import { CommonServiceService } from './common-service.service';
import { inject } from '@angular/core';

export const auth2Guard: CanActivateFn = (route, state) => {
  const commonService=inject(CommonServiceService)
  if(commonService.getUserRole()=="STUDENT"){
    return true;
    }
    else{
      return false;
    }
};
