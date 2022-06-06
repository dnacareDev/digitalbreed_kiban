package kr.or.ih.api.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.LoginService;
import kr.or.ih.api.service.mapper.LoginMapper;

@Service
public class LoginServiceImpl implements LoginService
{
	@Autowired
	private LoginMapper mapper;

	@Override
	public User SelectUser(String user_username, String user_password)
	{
		return mapper.SelectUser(user_username, user_password);
	}

	@Override
	public int CheckUsername(String user_username)
	{
		return mapper.CheckUsername(user_username);
	}

	@Override
	public int OldCheckUsername(String user_username, String old_password)
	{
		return mapper.OldCheckUsername(user_username, old_password);
	}
		
	
	@Override
	public int Join(String user_username, String user_password)
	{
		return mapper.Join(user_username, user_password);
	}

	@Override
	public int UpdatePassword(String user_username, String user_password)
	{
		return mapper.UpdatePassword(user_username, user_password);
	}
}