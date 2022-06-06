package kr.or.ih.api.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.ih.api.entity.Counts;
import kr.or.ih.api.entity.Notice;
import kr.or.ih.api.service.HomeService;
import kr.or.ih.api.service.mapper.HomeMapper;

@Service
public class HomeServiceImpl implements HomeService
{
	@Autowired
	private HomeMapper mapper;

	// 알림 조회
	@Override
	public List<Notice> SelectNotice(String user_username)
	{
		return mapper.SelectNotice(user_username);
	}

	// 알림 삭제
	@Override
	public int DeleteNotice(String user_username, int outcome_id)
	{ 
		int result = mapper.DeleteNotice(user_username, outcome_id);	
		
		return result;
	}

	@Override
	public Counts SelectFirstCount(String user_username)
	{
		return mapper.SelectFirstCount(user_username);
	}

	@Override
	public Counts SelectSecondCount(String user_username) 
	{
		return mapper.SelectSecondCount(user_username);
	}

	@Override
	public Counts SelectThirdCount(String user_username) 
	{
		return mapper.SelectThirdCount(user_username);
	}
	
	@Override
	public Counts SelectTotalCount(String user_username)
	{
		return mapper.SelectTotalCount(user_username);
	}

	@Override
	public Counts SelectFileCount(String user_username)
	{
		return mapper.SelectFileCount(user_username);
	}
}