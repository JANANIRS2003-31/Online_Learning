import { CanActivateFn } from '@angular/router';
import { CommonServiceService } from './common-service.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const commonService=inject(CommonServiceService)
  if(commonService.getUserRole()=="ADMIN"){
    return true;
    }
    else{
      return false;
    }
};
