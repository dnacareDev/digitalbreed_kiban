package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Counts;
import kr.or.ih.api.entity.User;

public interface ManageService
{
	List<Counts> SelectManage();

	int UpdateUserStatus(String user_username, int user_status);
}