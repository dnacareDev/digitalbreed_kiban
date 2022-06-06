package kr.or.ih.api.service;

import java.util.List;

import kr.or.ih.api.entity.Counts;
import kr.or.ih.api.entity.Notice;

public interface HomeService
{
	// 알림 조회
	List<Notice> SelectNotice(String user_username);
	
	// 알림 삭제
	int DeleteNotice(String user_username, int outcome_id);

	Counts SelectFirstCount(String user_username);

	Counts SelectSecondCount(String user_username);

	Counts SelectThirdCount(String user_username);
	
	Counts SelectTotalCount(String user_username);

	Counts SelectFileCount(String user_username);
}