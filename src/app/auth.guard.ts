import { CanActivateFn } from '@angular/router';
import { CommonServiceService } from './common-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const commonService=inject(CommonServiceService)
  if(commonService.getUserRole()=="ADMIN"||commonService.getUserRole()=="STUDENT"||commonService.getUserRole()=="INSTRUCTOR"){
    return true;
    }
    else{
      return false;
    }
};
