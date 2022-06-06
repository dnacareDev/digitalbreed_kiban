package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Counts;
import kr.or.ih.api.entity.User;
import kr.or.ih.api.service.ManageService;
import kr.or.ih.api.service.mapper.ManageMapper;

@Service
public class ManageServiceImpl implements ManageService
{
	@Autowired
	private ManageMapper mapper;

	@Override
	public List<Counts> SelectManage()
	{
		return mapper.SelectManage();
	}

	@Override
	public int UpdateUserStatus(String user_username, int user_status)
	{
		return mapper.UpdateUserStatus(user_username, user_status);
	}
}