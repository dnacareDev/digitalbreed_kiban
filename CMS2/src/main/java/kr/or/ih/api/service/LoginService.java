package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Outcome;
import kr.or.ih.api.entity.User;

public interface LoginService
{
	User SelectUser(String user_username, String user_password);

	int CheckUsername(String user_username);
	
	int OldCheckUsername(String user_username, String old_password);
	
	int Join(String user_username, String user_password);

	int UpdatePassword(String user_username, String user_password);
}