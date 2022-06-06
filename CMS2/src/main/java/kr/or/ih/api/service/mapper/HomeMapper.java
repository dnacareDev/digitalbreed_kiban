package kr.or.ih.api.service.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import egovframework.rte.psl.dataaccess.mapper.Mapper;
import kr.or.ih.api.entity.Counts;
import kr.or.ih.api.entity.Notice;

@Mapper
public interface HomeMapper
{
	// 알림 조회
	List<Notice> SelectNotice(String user_username);

	// 알림 삭제
	int DeleteNotice(@Param("user_username") String user_username, @Param("outcome_id") int outcome_id);

	Counts SelectFirstCount(String user_username);

	Counts SelectSecondCount(String user_username);

	Counts SelectThirdCount(String user_username);
	
	Counts SelectTotalCount(String user_username);

	Counts SelectFileCount(String user_username);
}